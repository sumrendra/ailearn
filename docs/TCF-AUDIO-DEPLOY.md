# Portainer: TCF listening audio volume

After deploying code with `AudioAsset` + volume-based API:

1. **Bind mount** on `ailearn-app`:
   - Host: `/home/sumrendra/ailearn-audio`
   - Container: `/data/audio`
   - Mode: read-only

2. **Environment variable:**
   - `AUDIO_ROOT=/data/audio`

3. **Upload audio** (from dev machine):
   ```bash
   npm run upload:tcf-audio:server
   ```

4. **Verify** (after redeploy):
   ```bash
   curl -s "https://ailearn.sumrendralabz.biz/api/tcf/listening/audio/status?paper=1"
   ```

**Portainer name conflict:** If deploy fails with `container name "/ailearn-app" is already in use`, stop and remove the old container first (`docker stop ailearn-app && docker rm ailearn-app`), then redeploy the stack.

Apply DB migration once via upload script (includes `AudioAsset` table SQL).
