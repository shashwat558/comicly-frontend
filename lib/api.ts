export async function uploadPDF(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', file.name)
  formData.append('author', 'Unknown') // Could be extracted or asked

  const response = await fetch('http://localhost:8000/api/upload/', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload PDF')
  }

  return response.json()
}

export async function generatePage(pageText: string, pageNumber: int, memory: any, prevImageUrl: string | null) {
  const response = await fetch('http://localhost:8000/api/generate/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_number: pageNumber,
      page_text: pageText,
      memory: memory,
      prev_image_url: prevImageUrl,
    }),
  })

  if (!response.ok) {
     throw new Error('Failed to generate page')
  }

  return response.json()
}
