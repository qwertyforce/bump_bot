import { Solver } from "2captcha"
import axios from "axios"
import FormData from 'form-data'
const solver = new Solver("")
const board = "mlp"
const site="4channel"
const post_url = `https://sys.${site}.org/${board}/post`
const board_url = `https://boards.${site}.org`
const replies=['Bump','bump','Boop','boop','Beep','beep','>page 10']
async function send_post(msg: string, thread_num: string) {
    try {
        const captcha_res = await solver.recaptcha("6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc", `${board_url}/${board}/thread/${thread_num}`)
        console.log(captcha_res)
        const form = new FormData();
        form.append("MAX_FILE_SIZE", '4194304');
        form.append("mode", 'regist');
        form.append("resto", thread_num);//thread number
        form.append("name", '');//name
        form.append("email", '');//options
        form.append("com", msg);//text message
        form.append("g-recaptcha-response", captcha_res.data)
        await axios.post(post_url, form.getBuffer(), {
            headers: {
                ...form.getHeaders(),
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": ": en-US,en;q=0.5",
                'Origin': board_url,
                'Referer': `${board_url}/`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
            }
        })
    } catch (e) {
        console.log(e)
        console.log(e?.response?.data)
    }
}

const target_threads: number[] = []
setInterval(async function () {
    const resp = await axios.get(`https://a.4cdn.org/${board}/threads.json`)
    const resp_data = resp.data
    for (const page_data of resp_data) {
        const { page, threads } = page_data
        for (const thread of threads) {
            if (target_threads.includes(thread.no)) {
                console.log(`${thread.no} - ${page} page`)
                if (page === 10) {
                    console.log("sending bump")
                    await send_post(replies[Math.floor(Math.random() * replies.length)], thread.no)
                    console.log("bump sent")
                }
            }
        }
    }
}, 5*60*1000);
