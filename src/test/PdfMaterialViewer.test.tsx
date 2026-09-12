import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PdfMaterialViewer } from '../features/materials/components/PdfMaterialViewer'

describe('PdfMaterialViewer', () => {
  it('renders without throwing (import_react.use error) and displays clean zero-custom document', () => {
    render(
      <PdfMaterialViewer
        url="/sample-ielts-material.pdf"
        title="Test Material IELTS"
        subtitle="Passage 1 Climate Change"
        onClose={() => {}}
      />,
    )

    expect(screen.getByText('Test Material IELTS')).toBeInTheDocument()
    expect(screen.getByText('Passage 1 Climate Change')).toBeInTheDocument()
    expect(screen.getByText('Quay lại')).toBeInTheDocument()
    expect(screen.getByTitle('Mục lục')).toBeInTheDocument()
  })
})
