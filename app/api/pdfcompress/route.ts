import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Create new FormData
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Log request details
    console.log('Sending request to backend...');
    
    const backendResponse = await fetch(
      "http://localhost:8080/api/v1/misc/compress-pdf",
      {
        method: "POST",
        body: backendFormData,
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      return new NextResponse(`Backend error: ${errorText}`, { status: backendResponse.status });
    }

    const compressedPdf = await backendResponse.blob();
    
    if (!compressedPdf.size) {
      throw new Error('Received empty PDF from backend');
    }

    return new NextResponse(compressedPdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed-${(file as File).name}"`,
      },
    });

  } catch (error) {
    console.error('Compression error:', error);
    return new NextResponse(
      `Error compressing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
