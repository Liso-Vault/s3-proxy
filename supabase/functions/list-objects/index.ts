import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { S3Object } from "https://deno.land/x/s3_lite_client@0.2.0/client.ts";
import { respond } from "../_shared/response.ts";
import { s3 } from "../_shared/s3.ts";

serve(async (req) => {
  const { address, path } = await req.json();

  // if invalid params
  if (!address || address.length < 42) {
    return respond(400, {}, [
      {
        code: 1,
        message: "Invalid parameters",
      },
    ]);
  }

  const listObjects = s3.listObjects({
    prefix: `${address}/${path}`,
  });

  const objects: Array<S3Object> = [];
  for await (const e of listObjects) objects.push(e);

  return respond(200, {
    count: objects.length,
    size: objects.reduce((a, b) => a + b.size, 0),
    objects: objects,
  });
});