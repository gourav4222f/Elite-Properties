import { normalizeEnquiry, validateEnquiry } from "@/lib/enquiry";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "The enquiry could not be read." }, { status: 400 });
  }

  const enquiry = normalizeEnquiry(payload);

  // Bots fill every field; accept quietly so they learn nothing.
  if (enquiry.company) return Response.json({ ok: true });

  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  // Delivery point: forward the enquiry to email or a CRM here. Until then it is
  // recorded in the server log so no enquiry is lost.
  console.info("[enquiry]", JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }));

  return Response.json({ ok: true });
}
