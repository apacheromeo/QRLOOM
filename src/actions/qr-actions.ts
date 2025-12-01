'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateQRSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
});

export type UpdateQRState = {
    errors?: {
        title?: string[];
        description?: string[];
    };
    message?: string | null;
};

export async function updateQRCode(
    prevState: UpdateQRState,
    formData: FormData
): Promise<UpdateQRState> {
    const validatedFields = updateQRSchema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update QR Code.',
        };
    }

    const { id, title, description } = validatedFields.data;

    try {
        // Simulate DB update
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Updated QR ${id}: ${title} - ${description}`);

        revalidatePath(`/qr-codes/${id}`);
        return { message: 'QR Code Updated Successfully!' };
    } catch (error) {
        return { message: 'Database Error: Failed to Update QR Code.' };
    }
}
