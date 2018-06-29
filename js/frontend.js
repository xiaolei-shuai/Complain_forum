// require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

"use strict";

var Nebulas = require("nebulas");
var NebPay = require("nebpay");

var neb = new Nebulas.Neb();
var api = neb.api;
var nebPay = new NebPay();
var userAddrerss;

neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
// neb.setRequest(new Nebulas.HttpRequest("http://localhost:8685"));      // 本地節點測試

// var dappAddress = 'n1eM7UXtVosJF7S6ht9q6Mrh8Wftkm4X7wy';   // 合約地址
var dappAddress = 'n1ovn4GPda3qnbk8AHXtvWWpwLkscttudzz'; // 合約地址
var testUser = 'n1SZdYuB9kd6kpLBaCgxrPrV29175st5NVD';
var serialNumber; //交易序列号

var latestBlogsData;
var hotBlogsData;
var weeklyBlogData;

// nebulas call test
function test() {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            // function: "test",
            // function: "addPost",
            function: "getPost",
            args: '[0]'
            // args: '["123", "n1V4ucZz1kAkffHik4WBeEu3fiFf7gcfMEd", "456"]'
        }
    }).then(function (resp) {
        // var result = resp.result;
        // console.log("im in")
        console.log(resp);
        //code
    });
}

function getBlog(option) {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getPost",
            args: JSON.stringify([option])
        }
    }).then(function (resp) {
        console.log(resp);
    });
}

function getMessage(option) {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getMessage",
            args: JSON.stringify([option])
        }
    }).then(function (resp) {
        console.log(resp);
    });
}

function initLatest() {
    api.call({
        chainID: 1,
        from: dappAddress,
        to: dappAddress,
        value: 0,
        nonce: 1,
        gasPrice: 1000000,
        gasLimit: 2000000,
        contract: {
            function: "getPost",
            args: JSON.stringify([0])
        }
    }).then(function (resp) {
        //console.log(resp);
        if (resp.result === "") {
            //initLatest();
        } else {
            latestBlogsData = resp.result;
            //$("#latest-section").append()
            let data = JSON.parse(resp.result);
            for (let i = 0; i < data.length; i++) {
                $("#latest-section").append('<div class="blog" id="blog-'+data[i].blogId+'">');
                if (data[i].name === ""){
                    $('<p/ class="author" style="color: orange;">').text("Anonymous").appendTo("#blog-"+data[i].blogId);
                }else{
                    $('<p/ class="author">').text(data[i].name).appendTo("#blog-"+data[i].blogId);
                }
                $('<p/ class="content">').text(data[i].content).appendTo("#blog-"+data[i].blogId);
                $("#blog-"+data[i].blogId).append('<div class="info-section"><b class="thumb-up-pre">👍🏿</b><b class="like-count">'+data[i].like+'</b><b class="thumb-down-pre">👎🏿</b><b class="dislike-count">'+data[i].dislike+'</b><img class="message-img message-btn" src="image/speech-bubble.png"><b class="message-count">'+data[i].messageCount+'</b></div>')
                $("#blog-"+data[i].blogId).append('<div class="message-section"></div>')
            }
            $(".thumb-up-pre").hover((event) => {
                event.currentTarget.textContent = "👍";
            }, (event) => {
                event.currentTarget.textContent = "👍🏿";
            });
        
            $(".thumb-down-pre").hover((event) => {
                event.currentTarget.textContent = "👎";
            }, (event) => {
                event.currentTarget.textContent = "👎🏿";
            });
        }
    });
}

// nebpay call addPost
function addPost(callArgs) {
    var to = dappAddress;
    var value = 0;
    var callFunction = "addPost";
   
    serialNumber =  nebPay.call(to, value, callFunction, callArgs) 
    // if (serialNumber) {
    //     $.notify({
    //         // options
    //         message: "Querying, please wait." ,
    //         target: "generate"
    //     },{
    //         // settings
    //         element: "body",
    //         position: null,
    //         offset: 20,
    //         placement: {
    //             // from: "center",
    //             align: "right"
    //         },
    //         spacing: 20,
    //         newest_on_top: true,
    //         delay: 3000,
    //         timer: 5000,
    //         z_index: 99999,
    //         type: 'info'
    //     });
    // }

    var options = {callback: NebPay.config.testnetUrl}
    nebPay.queryPayInfo(serialNumber, options) //search transaction result from server (result upload to server by app)
        .then(function (resp) {
            console.log(resp)
        })
        .catch(function (err) {
            console.log(err);
        });
}

function addMessage(callArgs) {
    var to = dappAddress;
    var value = 0;
    var callFunction = "addMessage";
   
    serialNumber =  nebPay.call(to, value, callFunction, callArgs) 

    var options = {callback: NebPay.config.testnetUrl}
    nebPay.queryPayInfo(serialNumber, options) //search transaction result from server (result upload to server by app)
        .then(function (resp) {
            console.log(resp)
        })
        .catch(function (err) {
            console.log(err);
        });
}


// 獲取用戶地址
function getUserAddress() {
    console.log("********* get account ************")
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");
}

// listen message from contentscript
window.addEventListener('message', function (e) {
    // e.detail contains the transferred data (can
    console.log("recived by page:" + e + ", e.data:" + JSON.stringify(e.data));
    if (!!e.data.data && !!e.data.data.account) {
        userAddrerss = e.data.data.account;
    }
})
getUserAddress()