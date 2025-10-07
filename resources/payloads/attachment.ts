import { readFileSync } from 'fs';
import { join } from 'path';
import { faker } from '@faker-js/faker';

type AttachmentByUrl = {
	url: string;
	name: string;
	setCover?: boolean;
};

type AttachmentByBase64 = {
	fileBase64: string;
	name?: string;
	mimeType?: string;
};

const attachmentsDataPath = join(__dirname, '../../data/attachment.json');

function loadImages(): Array<{ name: string; url: string }> {
	const raw = readFileSync(attachmentsDataPath, 'utf-8');
	try {
		return JSON.parse(raw);
	} catch (e) {
		return [];
	}
}

export function randomAttachmentByUrl(): AttachmentByUrl {
	const images = loadImages();
	const choice = images.length ? faker.helpers.arrayElement(images) : { url: faker.image.url(), name: faker.lorem.words(2) };
	return {
		url: choice.url,
		name: `Random Attachment - ${choice.name ?? faker.lorem.words(2)}`,
		setCover: faker.datatype.boolean(),
	};
}

export function attachmentFromLocalFileAsBase64(filePath: string, mimeType?: string): AttachmentByBase64 {
	const absolute = join(process.cwd(), filePath);
	const buffer = readFileSync(absolute);
	return {
		fileBase64: buffer.toString('base64'),
		name: faker.system.fileName(),
		mimeType: mimeType || 'application/octet-stream',
	};
}

// Helper para construir el payload completo que usará los tests y validaciones
export function buildAttachmentInput(
	cardId: string,
	body: AttachmentByUrl | AttachmentByBase64 | Record<string, any>,
	opts?: { validate?: boolean; headers?: Record<string, string>; extraQuery?: Record<string, string> }
) {
	// import dinámico para evitar ciclos en tiempo de compilación
	// Schema validation y authParams se resuelven en tiempo de ejecución
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { authParams } = require('../../config/auth/api/auth-params');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { AssertionAttachment } = require('../../assertions/assertion-attachment');

	const query = authParams(opts?.extraQuery);
	const headers = { Accept: 'application/json', ...(opts?.headers ?? {}) };

	const payload = {
		pathParams: { id: cardId },
		query,
		headers,
		body,
	};

	if (opts?.validate) {
		AssertionAttachment.assert_post_input_schema(payload);
	}

	return payload;
}

export default {
	randomAttachmentByUrl,
	attachmentFromLocalFileAsBase64,
 buildAttachmentInput,
};

