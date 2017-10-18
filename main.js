let outputElem = document.querySelector("output")

// set up AudioContext for generating and broadcasting
let sendCtx = new AudioContext()
oscillator = sendCtx.createOscillator()
oscillator.frequency.value = 21000
oscillator.connect(sendCtx.destination)
document.querySelector("#broadcast-button").onclick = function() {
  oscillator.start(0)
  document.querySelector("#broadcast-button").onclick = function() {
    oscillator.stop(0)
  }
}

// set up context for receiving, and connect mic to it
let recvCtx = new AudioContext()
navigator.getUserMedia({ audio: true }, function(stream) {
  // https://gist.github.com/torgeir/6627296
  var analyser = recvCtx.createAnalyser()
  analyser.smoothingTimeConstant = 0.1
  analyser.fftSize = 1024

  var max

  var node = recvCtx.createScriptProcessor(2048, 1, 1)
  node.onaudioprocess = function() {
    // bitcount is fftsize / 2
    var array = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(array)
    var arraySliced = array.slice(447, 449) // 448 += 1

    if (Math.max(...arraySliced) > 150) {
      outputElem.textContent = "1"
    } else {
      outputElem.textContent = "0"
    }

  }

  // setTimeout(function() {
  //   node.onaudioprocess = null
  // }, 10000)

  var input = recvCtx.createMediaStreamSource(stream)

  input.connect(analyser)
  analyser.connect(node)
  node.connect(recvCtx.destination)
}, function() {
  console.log(arguments)
})
