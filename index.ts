import { Solver } from "2captcha"
import axios from "axios"
import FormData from 'form-data'
import tunnel from 'tunnel'
// import SocksProxy from "socks-proxy-agent"
const solver = new Solver("")
// const httpsAgent1 = SocksProxy(`socks5://127.0.0.1:8888/`);
// const client1 = axios.create({httpsAgent:httpsAgent1});
// const asfqwf:any=(tunnel as any).httpsOverHttp({ 
//     proxy:{
//     host: '127.0.0.1',
//     port: 8888,
// },
// rejectUnauthorized: false
// })

//  const axiosInstance = axios.create({
//     httpsAgent: asfqwf,
    
//     proxy: false,
//   });
 
async function send_post(msg:string){
    const captcha_res=await solver.recaptcha("6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc", "https://boards.4channel.org/mlp/thread/36306000")
    console.log(captcha_res)
    const form = new FormData();
    form.append("MAX_FILE_SIZE", '4194304');
    form.append("mode", 'regist');
    form.append("resto", '36306000');//thread number
    form.append("name", '');//name
    form.append("email", '');//options
    form.append("com", msg);//text message
    form.append("g-recaptcha-response",captcha_res.data);

    try{
        const response = await axios.post("https://sys.4channel.org/mlp/post",form.getBuffer(),{
            headers:{ ...form.getHeaders(),'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' }
        })
        console.log(response.data)
    }catch(e){
        console.log(e)
        console.log(e?.response?.data)
    }
}

async function run(){
 await send_post("bump")
}
run()