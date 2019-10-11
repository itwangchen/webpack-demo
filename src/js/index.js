import '../css/common/frame.css';
import '../css/common/iconfont.css';
import '../css/pages/index.styl';

import {printMe} from './print.js';
// import './styles.css';
$('#info').text('jQuery正常使用');
function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');
    element.innerHTML = ['', 'webpack'].join('');

    btn.innerHTML = '点击';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
}

let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);


if (module.hot) {
    module.hot.accept('./print.js', function () {
        console.log('Accepting the updated printMe module!');
        document.body.removeChild(element);
        element = component(); // 重新渲染页面后，component 更新 click 事件处理
        document.body.appendChild(element);
    })
}