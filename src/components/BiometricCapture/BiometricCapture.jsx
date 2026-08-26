import React, { useState, useEffect, useRef } from 'react';
import './BiometricCapture.css';

const BiometricCapture = ({ onCaptureComplete, mode = 'registration', storedFacialData = null }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [instructions, setInstructions] = useState(
    mode === 'verification' 
      ? 'Position your face for verification' 
      : 'Position your face in the center of the frame'
  );

  useEffect(() => {
    // Simple camera initialization
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera access granted');
      setStream(mediaStream);
      
      if (videoRef.current) {
        console.log('Attaching stream to video element');
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play()
            .then(() => {
              console.log('Video playing successfully');
              setIsLoading(false);
              startFaceDetection();
            })
            .catch(err => {
              console.error('Play error:', err);
              setError('Unable to play video: ' + err.message);
              setIsLoading(false);
            });
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          setError('Video error occurred. Please refresh.');
          setIsLoading(false);
        };
        
        // Force video to play after a delay
        setTimeout(() => {
          if (videoRef.current && videoRef.current.paused) {
            console.log('Forcing video play');
            videoRef.current.play();
            setIsLoading(false);
          }
        }, 2000);
      } else {
        console.error('Video element not available');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please check your camera.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another app.');
      } else {
        setError('Camera error: ' + err.message);
      }
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startFaceDetection = () => {
    // Simple face detection simulation using canvas
    // In production, this would use face-api.js or similar
    const detectInterval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        // Check if video has valid dimensions
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const ctx = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          
          // Simulate face detection - in production use actual face-api.js
          // For now, we'll use a simple heuristic
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const faceDetected = detectFace(imageData);
          
          setFaceDetected(faceDetected);
          
          if (faceDetected) {
            setInstructions('Face detected! Click capture to register your biometric data.');
          } else {
            setInstructions('Position your face in the center of the frame');
          }
        }
      }
    }, 100);

    return () => clearInterval(detectInterval);
  };

  const detectFace = (imageData) => {
    // Simple face detection simulation
    // In production, replace with actual face-api.js detection
    const data = imageData.data;
    let skinTonePixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple skin tone detection
      if (r > 95 && g > 40 && b > 20 &&
          r > g && r > b &&
          Math.abs(r - g) > 15 && r - g > 15) {
        skinTonePixels++;
      }
    }
    
    // If we detect enough skin tone pixels, assume face is present
    return skinTonePixels > (imageData.width * imageData.height * 0.1);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Simulate facial encoding generation
    const facialEncoding = generateFacialEncoding(imageData);
    
    const newImage = {
      data: imageData,
      encoding: facialEncoding,
      timestamp: new Date().toISOString()
    };
    
    setCapturedImages(prev => [...prev, newImage]);
    setCaptureCount(prev => prev + 1);
    setIsCapturing(false);
    
    if (mode === 'verification') {
      setInstructions('Verification complete! Click Finish to verify and login.');
    } else if (captureCount + 1 >= 3) {
      setInstructions('Biometric registration complete! Click Finish to save.');
    } else {
      setInstructions(`Capture ${captureCount + 1} of 3 complete. Position your face differently.`);
    }
  };

  const generateFacialEncoding = (imageData) => {
    // Simulate facial encoding generation with deterministic approach
    // In production, this would use face-api.js to generate actual encodings
    // For simulation, we'll create a pseudo-random encoding based on image data hash
    
    // Create a simple hash from the image data
    let hash = 0;
    for (let i = 0; i < imageData.length; i++) {
      const char = imageData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Use the hash as a seed for pseudo-random generation
    const seed = Math.abs(hash);
    const encoding = [];
    
    for (let i = 0; i < 128; i++) {
      // Simple pseudo-random number generator using the seed
      const random = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
      encoding.push(random);
    }
    
    return encoding;
  };

  const compareFacialData = (currentEncoding, storedEncodings) => {
    // Compare current facial encoding with stored encodings
    // In production, this would use cosine similarity or Euclidean distance
    // For simulation, we'll use a simple comparison
    
    if (!storedEncodings || storedEncodings.length === 0) {
      return 0; // No match if no stored data
    }

    // Calculate similarity with each stored encoding and take the maximum
    let maxSimilarity = 0;
    
    for (const storedEncoding of storedEncodings) {
      if (!storedEncoding || storedEncoding.length !== currentEncoding.length) {
        continue;
      }

      // Calculate cosine similarity (simplified for simulation)
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;

      for (let i = 0; i < currentEncoding.length; i++) {
        dotProduct += currentEncoding[i] * storedEncoding[i];
        normA += currentEncoding[i] * currentEncoding[i];
        normB += storedEncoding[i] * storedEncoding[i];
      }

      const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
      maxSimilarity = Math.max(maxSimilarity, Math.abs(similarity));
    }

    console.log('Maximum similarity:', maxSimilarity);
    return maxSimilarity;
  };

  const handleRetake = (index) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    setCaptureCount(prev => prev - 1);
    setInstructions('Image removed. Capture another image.');
  };

  const handleFinish = () => {
    if (mode === 'verification') {
      // For verification, just need 1 image
      if (capturedImages.length >= 1) {
        const facialData = capturedImages.map(img => img.encoding);
        const images = capturedImages.map(img => img.data);
        
        // If stored facial data is provided, perform verification
        if (storedFacialData && storedFacialData.length > 0) {
          const matchScore = compareFacialData(facialData[0], storedFacialData);
          console.log('Facial match score:', matchScore);
          
          // Threshold for facial recognition (0.6 is a reasonable threshold for simulated data)
          const MATCH_THRESHOLD = 0.6;
          
          if (matchScore >= MATCH_THRESHOLD) {
            onCaptureComplete({
              facialData,
              images,
              success: true,
              matchScore
            });
          } else {
            setError(`Facial verification failed. Match score: ${(matchScore * 100).toFixed(1)}%. Please try again or contact support.`);
            setCapturedImages([]);
            setCaptureCount(0);
            setInstructions('Facial verification failed. Please capture your face again.');
          }
        } else {
          // No stored data for comparison, proceed without verification (fallback)
          console.warn('No stored facial data provided for verification');
          onCaptureComplete({
            facialData,
            images,
            success: true,
            matchScore: 1.0
          });
        }
      } else {
        setError('Please capture at least 1 image for verification.');
      }
    } else {
      // For registration, need 3 images
      if (capturedImages.length >= 3) {
        const facialData = capturedImages.map(img => img.encoding);
        const images = capturedImages.map(img => img.data);
        
        onCaptureComplete({
          facialData,
          images,
          success: true
        });
      } else {
        setError('Please capture at least 3 images for proper biometric registration.');
      }
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCaptureComplete({
      success: false,
      cancelled: true
    });
  };

  return (
    <div className="biometric-capture">
      <div className="biometric-header">
        <h3>Biometric {mode === 'registration' ? 'Registration' : 'Verification'}</h3>
        <p className="instructions">{instructions}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="camera-container">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Initializing camera...</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-feed"
            />
            <canvas ref={canvasRef} className="hidden-canvas" />
            
            {faceDetected && (
              <div className="face-indicator">
                <div className="face-frame"></div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="captured-images">
        {capturedImages.map((image, index) => (
          <div key={index} className="captured-image-container">
            <img src={image.data} alt={`Capture ${index + 1}`} />
            <button
              type="button"
              className="retake-button"
              onClick={() => handleRetake(index)}
            >
              ✕
            </button>
          </div>
        ))}
        
        {Array.from({ length: (mode === 'verification' ? 1 : 3) - capturedImages.length }).map((_, index) => (
          <div key={`placeholder-${index}`} className="image-placeholder">
            <span>Capture {capturedImages.length + index + 1}</span>
          </div>
        ))}
      </div>

      <div className="capture-controls">
        <button
          type="button"
          className="capture-button"
          onClick={captureImage}
          disabled={isCapturing || capturedImages.length >= (mode === 'verification' ? 1 : 3)}
        >
          {isCapturing ? <div className="spinner"></div> : '📷 Capture'}
        </button>
        
        <button
          type="button"
          className="finish-button"
          onClick={handleFinish}
          disabled={capturedImages.length < (mode === 'verification' ? 1 : 3)}
        >
          {mode === 'verification' ? '✓ Verify & Login' : '✓ Finish Registration'}
        </button>
        
        <button
          type="button"
          className="cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      <div className="biometric-info">
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Position your face in the center of the frame</li>
          <li>Ensure good lighting (avoid backlighting)</li>
          <li>Remove glasses if possible</li>
          <li>Capture 3 images from slightly different angles</li>
          <li>Keep a neutral expression</li>
        </ul>
      </div>
    </div>
  );
};

export default BiometricCapture;