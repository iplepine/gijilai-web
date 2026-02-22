# LLM Integration API

## Overview
This API endpoint generates a personalized temperament report based on TCI scores. It supports both "Parent Self-Report" and "Child Report" (Gardening Report).

## Endpoint
\`POST /api/llm/report\`

## Request Format
**Content-Type:** \`application/json\`

### Body Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`type\` | String | Yes | Report type: \`'PARENT'\` or \`'CHILD'\` |
| \`scores\` | Object | Yes | TCI score object |
| \`scores.NS\` | Number | Yes | Novelty Seeking (0-100) |
| \`scores.HA\` | Number | Yes | Harm Avoidance (0-100) |
| \`scores.RD\` | Number | Yes | Reward Dependence (0-100) |
| \`scores.P\` | Number | Yes | Persistence (0-100) |
| \`userName\` | String | Yes | Name of the subject (Parent or Child) |

### Example Request
\`\`\`json
{
  "type": "CHILD",
  "scores": {
    "NS": 80,
    "HA": 20,
    "RD": 60,
    "P": 40
  },
  "userName": "민수"
}
\`\`\`

## Response Format
**Content-Type:** \`application/json\`

### Success Response (200 OK)
\`\`\`json
{
  "report": "# 🌿 [민수] 맞춤형 기질 리포트\n\n## 🌸 양육자님, 오늘 하루도..."
}
\`\`\`

### Error Response (400 Bad Request)
\`\`\`json
{
  "error": "Missing required fields or invalid type"
}
\`\`\`

### Error Response (500 Internal Server Error)
\`\`\`json
{
  "error": "Failed to generate report"
}
\`\`\`
