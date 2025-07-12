export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://172.210.82.112:5001',
  apiEndpoints: {
    parsePdf: '/api/parse-pdf',
    analyze: '/analyze'
  }
} 