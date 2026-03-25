import fs from "fs"
import path from "path"

export async function GET() {
  const dataPath = path.join(process.cwd(), "public", "model-predictions.json")

  if (!fs.existsSync(dataPath)) {
    return new Response(JSON.stringify({ error: "Model predictions file not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const raw = await fs.promises.readFile(dataPath, "utf-8")
  const modelData = JSON.parse(raw)

  return new Response(JSON.stringify(modelData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
