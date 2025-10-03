import db from "@/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
    req: NextRequest,
    {
        params: { downloadVerificationId },
    }: { params: { downloadVerificationId: string } }
) {
    const data = await db.downloadVerification.findUnique({
        where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
        select: { product: { select: { name: true, filePath: true } } },
    });

    if (!data) {
        return NextResponse.redirect(
            new URL("/products/download/expired", req.url)
        );
    }

    const product = data.product;

    const file = await fs.readFile(product.filePath);
    const extension = product.filePath.split(".").pop();
    const { size } = await fs.stat(product.filePath);

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
            "Content-Length": size.toString(),
        },
    });
}
