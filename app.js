$(document).click(function () {
    if (!input.is(':focus')) {
        input.focus();
    }
})
let audio = new AudioContext();
function beep(){
    let osc = audio.createOscillator();
    let gain = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    gain.gain.value = 0.07;
    osc.start(audio.currentTime);
    osc.stop(audio.currentTime + 0.1);
}

let input = $('#input');
let history = $('#history');
let count = 0
let command_history = [""]


const prompt = `<span class="user">you@kyrstr-website</span><span class="symbols">:</span><span class="directory">~</span><span class="symbols">$</span>&nbsp;`;
const files = {
    'about_me.txt': `Hey!, I'm Obehag and i'm 21.<br> I was born in Sweden <br> and I continue my life in Sweden<br><br>
    I like listening to music and playing guitar <br> I try to improve myself <br><br>isn't that enough? <br> write 'contact' to contact me <br> `, 
    'social.txt': `No Social Skills :(`
}

const commands = {
    'help': 'guess what? <br>',
    'about': 'information about myself <br>',
    'contact': 'contact with me <br>',
    'clear': 'clear. <br>',
}

function cmd_controller(input_value) {
    let [cmd, ...args] = input_value
        .split(' ')
        .filter((arg) => {return arg.trim() !== ""})
    if (cmd == undefined) {
        null
    } else {
        command_history.push(input_value)
        if (Object.keys(commands).includes(cmd)) {
            if (cmd == 'help') {
                history.append(Object.entries(commands)
                    .map(command => command.join(': '))
                    .join('<br>')
                )
            } else if (cmd == 'clear') {
                history.html('')
            } else if (cmd == 'about') {
                history.append(files['about_me.txt'])
            } else if (cmd == 'contact') {
                history.append(files['social.txt'])
            }
        } else {
            history.append(`error: command not found: ${cmd}. Try 'help' to get started.`)
        }
    }
}

$('#prompt').html(prompt)
input.keydown(function (event) {
    let key = event.which;
    let input_value = input.val()
    if (key == 13) { 
        history.append(prompt + input_value);
        history.append('<br>');
        cmd_controller(input_value)
        history.append(history.html() && input_value ? '<br>' : '');
        input.val('');
    }
    if (key == 8 && input_value == "") {
        beep()
    }
    if (key == 38) { 
        if (count > -command_history.length + 1) {
            count -= 1
        } else {
            beep()
        }
        input.val(command_history.at(count))
    }
    if (key == 40) { 
        if (count < 0) {
            count += 1
            input.val(command_history.at(count))
        } else {
            beep()
        }
    }

    let all_args = [...Object.keys(files), ...Object.keys(commands)]
    let possible_args = []
    
    if (key == 9) {
        event.preventDefault()
        
        if (input_value.length > 1) {
            args = input_value
                .split(' ')
                .filter((arg) => {return arg.trim() !== ""}) 
            for (let i = 0; i < all_args.length; i++){
                arg = all_args[i]
                if (arg.startsWith(args.at(-1))) {
                    possible_args.push(arg)
                }
            }
            if (possible_args.length > 1) {
                history.append(prompt + input_value)
                history.append('<br>')
                history.append(possible_args.join(' '))
                history.append('<br>')
            } else if (possible_args.length == 1) {
                args.pop(-1)
                input.val(args.length > 0 ? args.join(' ') + ' ' + possible_args : possible_args)
            } else {
                beep()
            }
        } else {
            beep()
        }
    }
    $(".terminal").scrollTop($(".terminal")[0].scrollHeight);
});
