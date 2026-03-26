import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function GET() {
  const dataPath = path.join(process.cwd(), "public", "model-predictions.json");

  if (!fs.existsSync(dataPath)) {
    return new Response(
      JSON.stringify({ error: "Model predictions file not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const raw = await fs.promises.readFile(dataPath, "utf-8");
  const modelData = JSON.parse(raw);

  // Patch latest_prediction to add factors if missing
  // (frontend AttendancePrediction component expects factors.weather)
  if (modelData.latest_prediction && !modelData.latest_prediction.factors) {
    const lp = modelData.latest_prediction;
    modelData.latest_prediction.factors = {
      opponent: lp.match ?? null,
      opponent_tier: null,
      is_big6: null,
      position_gap: null,
      weather: "N/A",
      ticket_sales: null,
      phase_of_season: null,
    };
  }

  return new Response(JSON.stringify(modelData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      opponent,
      currentRound,
      totalRounds,
      opponentStanding,
      OHLStanding,
    } = body;

    const away_team = opponent;
    const away_standing = opponentStanding;
    const ohl_standing = OHLStanding;
    const match_day = currentRound;
    const total_days = totalRounds;
    const tickets_scanned = "";
    const csvPath = path.join(
      process.cwd(),
      "..",
      "model",
      "data",
      "cleaned_matches.csv",
    );
    const scriptPath = path.join(
      process.cwd(),
      "..",
      "model",
      "export_model_output.py",
    );

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(
        csvPath,
        "away_team,away_standing,ohl_standing,match_day,total_days,tickets_scanned\n",
      );
    }

    const newRow = `\n${opponent},${opponentStanding},${OHLStanding},${currentRound},${totalRounds},`;
    fs.appendFileSync(csvPath, newRow);

    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    try {
      execSync(`${pythonCmd} "${scriptPath}"`, {
        timeout: 30000,
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
      });
    } catch {
      execSync(`python3 "${scriptPath}"`, {
        timeout: 30000,
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Failed to run model" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
