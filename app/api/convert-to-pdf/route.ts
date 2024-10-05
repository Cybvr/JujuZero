import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import libre from 'libreoffice-convert';
import util from 'util';

const libreConvert = util.promisify(libre.convert);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = uuidv4();
    const inputPath = path.join('/tmp', `${fileName}.docx`);
    const outputPath = path.join('/tmp', `${fileName}.pdf`);

    // Write the uploaded file to disk
    await writeFile(inputPath, buffer);

    // Convert the file to PDF
    const docxBuf = await readFile(inputPath);
    const pdfBuf = await libreConvert(docxBuf, '.pdf', undefined);

    // Write the PDF to disk
    await writeFile(outputPath, pdfBuf);

    // Read the PDF file
    const pdfFile = await readFile(outputPath);

    // Clean up temporary files
    await unlink(inputPath);
    await unlink(outputPath);

    // Send the PDF file as a response
    return new NextResponse(pdfFile, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted_document.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error converting file:', error);
    return NextResponse.json({ error: 'Error converting file' }, { status: 500 });
  }
}