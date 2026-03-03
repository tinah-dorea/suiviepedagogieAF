$filePath = "f:\suiviepedagogiqueAF\frontend\src\pages\Sessions.jsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Fix the malformed JSX - replace the broken line
$fixedContent = $content -replace '</div></div></div><div className="flex justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>', "</div>`n              </div>`n            </div>`n`n            <div className=`"flex justify-end gap-3 mt-6 pt-6 border-t`" style={{ borderColor: COLORS.border }}>"

# Fix button indentation
$fixedContent = $fixedContent -replace '                <button type="button" onClick={closeAddForm}', '              <button type="button" onClick={closeAddForm}'
$fixedContent = $fixedContent -replace '                <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Ajouter</button>', '              <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all" style={{ background: COLORS.gradient }}>Ajouter</button>'
$fixedContent = $fixedContent -replace '                </div>', '              </div>'

Set-Content $filePath $fixedContent -Encoding UTF8 -NoNewline
Write-Host "File fixed successfully"
