import { useState, useRef, useEffect } from 'react';

function useMicrophone() {
    const [analyser, setAnalyser] = useState(null);
    const [dataArray, setDataArray] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    const mediaStream = useRef(null);
    const gainNodeRef = useRef(null);

    const startMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            const source = ctx.createMediaStreamSource(stream);
            const analyserNode = ctx.createAnalyser();
            const gainNode = ctx.createGain();

            // Boost gain slightly for quiet input (especially on mobile)
            gainNode.gain.value = /Android/i.test(navigator.userAgent) ? 2.0 : 1.5;

            analyserNode.fftSize = 4096;
            analyserNode.minDecibels = -90;
            analyserNode.smoothingTimeConstant = 0.1;

            const bufferLength = analyserNode.fftSize;
            const dataArrayRef = new Float32Array(bufferLength);

            source.connect(gainNode);
            gainNode.connect(analyserNode);

            mediaStream.current = stream;
            gainNodeRef.current = gainNode;
            setAudioContext(ctx);
            setAnalyser(analyserNode);
            setDataArray(dataArrayRef);

            console.log('✅ Microphone started and audio context is active');
            return true;
        } catch (error) {
            console.error('❌ Microphone access denied or error:', error);
            alert("Microphone access failed: " + error.message);
            return false;
        }
    };

    const stopMic = () => {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        if (audioContext) {
            audioContext.close();
            setAudioContext(null);
        }
        setAnalyser(null);
        setDataArray(null);
        console.log('🔇 Microphone stopped');
    };

    const getVolume = () => {
        if (!analyser || !dataArray) return 0;
        analyser.getFloatTimeDomainData(dataArray);
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sumSquares += dataArray[i] * dataArray[i];
        }
        return Math.sqrt(sumSquares / dataArray.length);
    };

    useEffect(() => {
        return () => stopMic();
    }, []);

    return {
        analyser,
        dataArray,
        startMic,
        stopMic,
        getVolume,
        sampleRate: audioContext?.sampleRate || 44100
    };
}

export default useMicrophone;
