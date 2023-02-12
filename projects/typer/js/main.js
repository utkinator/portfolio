const terminal = document.querySelector('.terminal');
let codeText = '';
let keyCount = 0;

function getRequest(url, callback) {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        callback(this.responseText);
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function getData(url, callback) {
    getRequest(url, function (data) {
        callback(data);
    });
}
getData("./data/js.txt", function (data) {
    codeText = data.split('');
});

terminal.value = '';
terminal.focus();
terminal.addEventListener('keydown', function (e) {
    e.preventDefault();

    if (!codeText[keyCount]) keyCount = 0; // Let's do it again

    terminal.value += codeText[keyCount];
    keyCount++;

    terminal.scrollTop = terminal.scrollHeight;
});
