// pdf-worker.ts - helper to load pdfjs worker
import * as pdfjs from 'pdfjs-dist'

// Use a specific version or dynamic import
if (typeof window !== 'undefined' && 'Worker' in window) {
  // Set worker source relative to public folder orcdn
  // This is often tricky in Next.js. A reliable way is using a CDN or copying the worker file.
  // We'll use the CDN for simplicity in this demo.
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

export const getPDFText = async (file: File): Promise<string[]> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    const pages: string[] = []

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const text = textContent.items.map((item: any) => item.str).join(' ')
        pages.push(text)
    }
    return pages
}
