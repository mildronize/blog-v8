+++
title = "Agent Skill: สอน AI Agent ให้ทำงานที่มันทำไม่ได้"
description = "แนวคิดและตัวอย่างการออกแบบ Agent Skill เพื่อขยายความสามารถของ AI Agent อย่าง Claude Code, Gemini CLI, Codex หรือ OpenClaw"
date = "2026-03-16"

[taxonomies]
tags = ["ai-agent", "skills", "claude-code"]
categories = ["AI"]
+++

สวัสดีครับ ช่วงนี้ผมใช้ AI agent ในการเขียนโค้ดเยอะขึ้นมากครับ ไม่ว่าจะเป็น Claude Code, Gemini CLI, Codex หรือ OpenClaw ซึ่งพวกนี้มันฉลาดก็จริง แต่มันก็มีเรื่องง่ายๆ ที่มันทำไม่ได้อยู่หลายอย่าง ผมเลยเริ่มทำสิ่งที่เรียกว่า Agent Skill ขึ้นมาครับ

![](cover.jpg)

## Agent Skill คืออะไร

ผมมองว่า Skill ก็คือ unit of work ที่เราเขียนไว้ให้ agent เรียกใช้ครับ อารมณ์เหมือนเราเขียน README ให้คนใหม่ในทีมอ่าน บอกว่า "ถ้าเจอเรื่องนี้ ให้รัน script นี้นะ" แต่คนอ่านเป็น AI agent แทน

เวลาเราสั่งอะไร agent มันจะดูก่อนว่าตัวเองมี skill อะไรบ้างที่ตรงกับสิ่งที่เราขอ ถ้ามีก็หยิบมาใช้ ถ้าไม่มีก็ทำแบบ general purpose ไป ซึ่งบางทีก็โอเค แต่บางทีก็พลาด

ตัว skill จริงๆ แล้วก็แค่ไฟล์ markdown ที่อธิบายว่า skill นี้ทำอะไรได้ มี script อะไรให้เรียก พร้อม parameter อะไรบ้าง แล้วก็อาจจะมี script แนบมาด้วย

```text
skill-name/
├── SKILL.md           # คำอธิบาย + คำสั่งใช้งาน
└── scripts/
    └── some_script.py # script ที่ agent จะเรียก
```

แนวคิดนี้ไม่ได้ผูกกับ agent ตัวไหนตัวนึงครับ Claude Code เรียกว่า skill, ตัวอื่นอาจจะเรียกว่า custom instruction หรือ tool definition แต่หลักการเดียวกัน คือเราเขียนคำอธิบายให้ agent อ่าน แล้วมันก็ตัดสินใจเองว่าจะเรียกใช้ตอนไหน

## ไปดูนิยามจริงๆ จาก doc กันดีกว่า

ก่อนที่จะไปดูตัวอย่าง ผมอยากลองเทียบกับ doc ของแต่ละเจ้าก่อนครับ ว่าเขานิยาม skill ไว้ว่ายังไงบ้าง

ฝั่ง **Anthropic** เขียนไว้ใน [doc ของ Claude Code](https://code.claude.com/docs/en/skills) ว่า "Skills extend what Claude can do. Create a SKILL.md file with instructions, and Claude adds it to its toolkit." แล้วก็บอกว่า Claude Code skills follow the [Agent Skills](https://agentskills.io) open standard ซึ่งเป็น open format ที่ใช้ข้ามเครื่องมือได้ โครงสร้างก็ตรงกับที่ผมอธิบายไว้ข้างบน คือ SKILL.md เป็น entrypoint แล้วก็มี scripts/, references/, assets/ เสริมได้ สิ่งที่ Claude Code เพิ่มเข้ามาเป็นพิเศษคือ frontmatter ที่ควบคุมได้ว่าใครเป็นคนเรียก skill (เราสั่งเอง หรือให้ Claude ตัดสินใจเอง) และยังรันเป็น subagent แยก context ได้ด้วย

ฝั่ง **OpenAI** ใน [doc ของ Codex](https://developers.openai.com/codex/skills/) ก็เขียนไว้คล้ายกันครับ "A skill packages instructions, resources, and optional scripts so Codex can follow a workflow reliably." โครงสร้างก็เหมือนกันเลย คือ SKILL.md + scripts/ + references/ ที่น่าสนใจคือ Codex บอกว่า custom prompts deprecated ไปแล้ว ให้ใช้ skills แทนสำหรับ reusable instructions

ส่วนฝั่ง **Google** ใน [Gemini CLI](https://geminicli.com/docs/cli/skills/) ก็ support Agent Skills เหมือนกัน เขาเขียนว่า skills เป็น "on-demand expertise" ที่ต่างจาก GEMINI.md ตรงที่ไม่ได้โหลดตลอดเวลา แต่จะ activate เมื่อ agent เห็นว่า task ตรงกับ skill description เท่านั้น ซึ่งช่วยไม่ให้ context window รก

ทีนี้พอย้อนกลับมาดู ผมว่าทุกเจ้ามองตรงกันในเรื่องหลักๆ ครับ คือ skill = ไฟล์ markdown ที่อธิบายว่าทำอะไร + script ที่ agent เรียกใช้ได้ แล้วก็เป็น open standard เดียวกันหมด เอาจากเจ้าไหนไปใช้เจ้าไหนก็ได้ สิ่งที่ต่างกันจริงๆ คือ feature เสริมของแต่ละเจ้า เช่น Claude Code มี subagent context, Codex มี agents/openai.yaml, Gemini CLI มี discovery tiers แต่ core ของมันก็ยังเป็น SKILL.md เหมือนกันทุกเจ้า

ซึ่งตรงกับที่ผมเข้าใจตั้งแต่แรกครับ ผมมอง skill ว่าเป็น "คู่มือที่เขียนให้ AI อ่าน" ไม่ต่างจากที่เราเขียน runbook ให้คนในทีม แค่คนอ่านเปลี่ยนจากมนุษย์เป็น agent แล้ว format ก็ถูก standardize ให้ทุก agent อ่านได้เหมือนกัน

## ตัวอย่างจริง: skill ที่ผมสร้างมาใช้เอง

ผมจะยกจากของจริงที่ใช้อยู่ครับ ตัวอย่างนี้ผมรันบน Claude Code แต่จะเห็นว่า script ข้างในมันก็แค่ Python ธรรมดา เอาไปใช้กับ agent อะไรก็ได้

### ถามเวลา

เรื่องง่ายๆ เลย "ตอนนี้กี่โมง" AI agent ส่วนใหญ่ตอบไม่ได้ครับ เพราะมันไม่มี access เข้า system clock ผมเลยสร้าง skill ชื่อ `time` ซึ่งข้างในก็แค่บอกให้มันรันคำสั่ง `date`

```markdown
# time/SKILL.md
Run the `date` command to get the current local time.
```

แค่นี้เลยครับ skill ไม่จำเป็นต้องซับซ้อน ถ้างานมันไม่ซับซ้อน ข้างในก็แค่บอกให้ agent รัน `date` แล้วเอา output มาตอบเรา

### ดู cost ของ session

อันนี้เริ่มมีเรื่องให้คิดแล้วครับ ผมอยากรู้ว่า session ที่ใช้อยู่กิน token ไปเท่าไหร่ ต้นทุนประมาณกี่เหรียญ Claude Code บันทึก session เป็นไฟล์ `.jsonl` ซึ่งข้างในมี token usage ของทุก turn ผมเลยสร้าง skill ชื่อ `claude-usage` ที่มี Python script ไปอ่านไฟล์นี้ รวม token ทุก turn แล้วคูณ pricing ของแต่ละ model

```bash
python3 .claude/skills/claude-usage/scripts/usage_summary.py <session-id>
```

output ออกมาก็ประมาณนี้:

```
  Session: 82c946c8-...
  Turns:   100

  Tokens
    Input:        150
    Cache write:  447.5k
    Cache read:   4.22m
    Output:       23.4k

  Estimated cost: $7.7249

  By model:
    claude-opus-4-6       23 turns  $5.5371
    claude-sonnet-4-6     77 turns  $2.1878
```

### ปัญหา: session ID มาจากไหน

ทีนี้ `claude-usage` มันต้องใส่ session ID ครับ แต่พอเราถาม agent ว่า "ตอนนี้ session ID อะไร" มันก็จะบอกว่าไม่รู้ เพราะเป็น internal ที่ agent เข้าถึงไม่ได้

ผมเลยต้องสร้างอีก skill นึงชื่อ `claude-session-id` ที่ไปหาไฟล์ `.jsonl` ทั้งหมดแล้วเรียงตาม modification time เพื่อหาว่า session ล่าสุดคืออันไหน

```bash
python3 .claude/skills/claude-session-id/scripts/latest_session.py
```

```
  Session ID: 82c946c8-1eb8-4c70-9414-813fc0a278e4
  Date: 2026-03-16 10:32
  Last message (assistant): Here's the updated README...
```

พอมี skill นี้แล้ว ถ้าผมบอกว่า "ดู cost ของ session ปัจจุบันหน่อย" agent ก็จะเรียก `claude-session-id` ก่อน แล้วเอา ID ที่ได้ไปเรียก `claude-usage` ต่อ ทำงานเองได้เลย

ตรงนี้เป็นจุดที่น่าสนใจครับ **skill มันต่อกันเป็น chain ได้** โดยที่เราไม่ต้องเขียน orchestration อะไรเลย agent มันจัดการเอง

### Todo management แบบ structured

ตัวอย่างสุดท้ายครับ ผมอยากให้ agent ช่วยจัดการ task สมมติว่าเราไม่สร้าง skill อะไรเลย มันก็จะจดลง markdown แบบ freeform ซึ่งพอ task เยอะขึ้นมันก็จะหาอะไรไม่เจอ update ผิด task ก็มี

ผมเลยสร้าง skill ชื่อ `todo` ที่เก็บ task เป็น JSONL event log แล้วมี Python script คอยจัดการ add, list, update, delete ให้หมด

```bash
# เพิ่ม task
python3 .claude/skills/todo/scripts/tasks.py add --title "Review PR" --priority P1 --domain Work

# ดู task ที่ยังไม่เสร็จ
python3 .claude/skills/todo/scripts/tasks.py list
```

```
[ ] [P1] a1b2c3d4  Review PR  [Work]
```

ข้อดีของการทำแบบนี้คือ agent อ่าน structured data ได้ตรงกว่า freeform markdown มากครับ มันจะ filter ตาม priority, ตาม domain, ตาม status ได้หมด เพราะ data format มันชัดเจน ไม่ต้องมาแกะ markdown เอง

## หลักการออกแบบ skill

จากที่ทำมาสักพักผมสรุปได้ประมาณนี้ครับ

อย่างแรกเลยคือ skill นึงควรทำแค่เรื่องนึง อย่าพยายามยัดทุกอย่างลง skill เดียว ถ้าแยกเรื่องได้ก็แยก อย่าง session ID กับ usage ผมแยกเป็นคนละ skill เพราะมันคนละความรับผิดชอบ

อีกเรื่องคือให้ script ทำงานหนักแทน agent ครับ แทนที่จะอธิบายยาวๆ ว่าให้ agent เขียน code อะไร เราเขียน script ให้มันเรียกตรงๆ ดีกว่า ผลลัพธ์ที่ได้จะ consistent กว่าเยอะ ถ้า skill ต้องการ parameter ที่อาจจะมาจาก skill อื่น การรับผ่าน env var อย่าง `AGENT_SESSION_ID` ก็ทำให้ต่อ chain ได้ง่ายครับ

สุดท้ายคือเรื่อง description ครับ ต้องเขียนให้ชัดเจน เพราะ agent จะอ่าน description ใน skill เพื่อตัดสินใจว่าจะใช้ skill นี้ไหม ถ้า description ไม่ชัด มันก็จะไม่หยิบมาใช้

## เทียบกับหลักการจาก official doc

พอผมลองไปอ่าน doc และบทความจากหลายเจ้า ก็พบว่าหลักการที่ผมสรุปมามันไปตรงกับที่เขาแนะนำไว้พอสมควรครับ

ฝั่ง OpenAI เขียนไว้ใน [Codex doc](https://developers.openai.com/codex/skills/) ว่า "Keep each skill focused on one job" กับ "Prefer instructions over scripts unless you need deterministic behavior" ซึ่งข้อแรกตรงกับที่ผมทำเลย คือแยก skill ละเรื่อง ส่วนข้อที่สองน่าสนใจ เพราะเขาบอกว่าถ้าไม่จำเป็นต้อง deterministic ก็ให้ใช้ instruction เป็นหลัก แต่จากประสบการณ์ผม ถ้าเป็นงานที่ต้องการ output ตรงกันทุกครั้ง (เช่น คำนวณ cost) ก็ควรเขียน script ดีกว่าจริงๆ ครับ

[บทความจาก Block](https://engineering.block.xyz/blog/3-principles-for-designing-agent-skills) (ทีมที่ทำ Goose) เขียนหลักการไว้ 3 ข้อที่ผมชอบมากครับ ข้อแรกคือ "Know what the agent should NOT decide" หมายความว่าอะไรที่ต้อง consistent ข้าม run อย่าปล่อยให้ agent คิดเอง ให้ใส่ใน script แทน ข้อที่สองคือ "Know what the agent SHOULD decide" คือปล่อยให้ agent ทำในสิ่งที่มันเก่ง เช่น ตีความ context, สรุปผล, แนะนำ ข้อที่สามคือ "Write a constitution, not a suggestion" เพราะ LLM ชอบทำตัวดีเกินไป ชอบข้ามขั้นตอน หรือเพิ่ม caveat ที่เราไม่ได้ขอ เลยต้องเขียน SKILL.md ให้ชัดเจนเหมือนกฎ ไม่ใช่แค่คำแนะนำ

ส่วนจาก [agentskills.io](https://agentskills.io) เอง มีจุดที่ผมคิดว่าสำคัญมากคือเรื่อง description ครับ เขาเขียนไว้ว่า "If your skill does not trigger, it is almost never the instructions — it is the description" ซึ่งตรงกับที่ผมบอกเลย description คือ interface จริงๆ ถ้าเขียนไม่ชัด skill ก็จะไม่ถูกเรียกใช้

พอเทียบกันแล้ว ผมว่าหลักการจากประสบการณ์ของผมกับ official doc มันไม่ได้ขัดกันเลยครับ แต่ doc มันให้ framework ที่ชัดกว่า โดยเฉพาะเรื่องการแบ่งว่าอะไรให้ agent ตัดสินใจ อะไรให้ script จัดการ ตรงนี้ช่วยให้ออกแบบ skill ได้ดีขึ้นเยอะ

## ลองเล่นได้

{% note(header="Note") %}
ผม open source skill พวกนี้ไว้ที่ [github.com/thaitype/skills](https://github.com/thaitype/skills) ครับ ใครอยากลองก็ install ผ่าน degit ได้เลย
{% end %}

```bash
npx degit thaitype/skills/claude-usage ~/.claude/skills/claude-usage
```

ก็หวังว่าจะเป็นประโยชน์กันนะครับ ใครมีไอเดีย skill อะไรมาแชร์กันได้ครับ สวัสดีครับ
