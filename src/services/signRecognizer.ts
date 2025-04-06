import * as tf from '@tensorflow/tfjs';

// Define the signs we want to recognize
export type SignType = 'hello' | 'sorry' | 'thanks' | 'iloveyou' | 'yes' | 'no' | 'help' | 'none';

interface SignConfidence {
  sign: SignType;
  confidence: number;
}

// Sample feature extraction from hand landmarks
export const extractFeatures = (landmarks: { x: number, y: number, z: number }[][]) => {
  // If no hands detected, return null
  if (!landmarks.length) return null;

  // We'll focus on the first hand detected
  const hand = landmarks[0];
  if (!hand || hand.length < 21) return null;

  // Extract relative positions and angles between key points
  const features = [];
  
  // Wrist position as reference
  const wrist = hand[0];
  
  // Calculate distances between wrist and each finger tip
  const fingerTips = [4, 8, 12, 16, 20];
  for (const tipIdx of fingerTips) {
    if (hand[tipIdx]) {
      const tip = hand[tipIdx];
      // Distance from wrist to tip
      const distance = Math.sqrt(
        Math.pow(tip.x - wrist.x, 2) + 
        Math.pow(tip.y - wrist.y, 2) + 
        Math.pow(tip.z - wrist.z, 2)
      );
      features.push(distance);
      
      // Angle between wrist and tip (simplified to 2D for this demo)
      const angle = Math.atan2(tip.y - wrist.y, tip.x - wrist.x);
      features.push(angle);
    }
  }
  
  // Calculate angles between finger joints
  for (let finger = 0; finger < 5; finger++) {
    const baseIdx = finger * 4 + (finger === 0 ? 1 : 0);
    for (let joint = 0; joint < 3; joint++) {
      const idx1 = baseIdx + joint;
      const idx2 = baseIdx + joint + 1;
      
      if (hand[idx1] && hand[idx2]) {
        // Joint bend angle
        const bend = Math.atan2(
          hand[idx2].y - hand[idx1].y,
          hand[idx2].x - hand[idx1].x
        );
        features.push(bend);
      }
    }
  }
  
  // Add relative positions between fingertips
  for (let i = 0; i < fingerTips.length; i++) {
    for (let j = i + 1; j < fingerTips.length; j++) {
      const tip1 = hand[fingerTips[i]];
      const tip2 = hand[fingerTips[j]];
      
      if (tip1 && tip2) {
        const distance = Math.sqrt(
          Math.pow(tip1.x - tip2.x, 2) + 
          Math.pow(tip1.y - tip2.y, 2) + 
          Math.pow(tip1.z - tip2.z, 2)
        );
        features.push(distance);
      }
    }
  }
  
  return features;
};

// In a real application, this would be a trained model
// This is a simplified rule-based classifier for demonstration
export const recognizeSign = (landmarks: { x: number, y: number, z: number }[][]): SignConfidence[] => {
  const features = extractFeatures(landmarks);
  if (!features) return [{ sign: 'none', confidence: 1.0 }];
  
  // Get first hand
  const hand = landmarks[0];
  
  // Define result array with default confidence values
  const results: SignConfidence[] = [
    { sign: 'hello', confidence: 0.05 },
    { sign: 'sorry', confidence: 0.05 },
    { sign: 'thanks', confidence: 0.05 },
    { sign: 'iloveyou', confidence: 0.05 },
    { sign: 'yes', confidence: 0.05 },
    { sign: 'no', confidence: 0.05 },
    { sign: 'help', confidence: 0.05 },
    { sign: 'none', confidence: 0.05 }
  ];
  
  // VERY simplified gesture detection logic
  // This is not how a real model would work, but it allows us to simulate recognition
  
  // Detect ILoveYou sign (pinky, index extended, other fingers closed)
  if (isFingerExtended(hand, 8) && isFingerExtended(hand, 20) && !isFingerExtended(hand, 12) && !isFingerExtended(hand, 16)) {
    results.find(r => r.sign === 'iloveyou')!.confidence = 0.9;
  }
  
  // Detect Yes sign (fist moving up and down - simplified to a closed fist)
  else if (!isAnyFingerExtended(hand)) {
    results.find(r => r.sign === 'yes')!.confidence = 0.85;
  }
  
  // Detect No sign (index finger wagging - simplified to just extended index)
  else if (isFingerExtended(hand, 8) && !isFingerExtended(hand, 12) && !isFingerExtended(hand, 16) && !isFingerExtended(hand, 20)) {
    results.find(r => r.sign === 'no')!.confidence = 0.8;
  }
  
  // Detect Hello sign (open palm waving - simplified to open palm)
  else if (isFingerExtended(hand, 8) && isFingerExtended(hand, 12) && isFingerExtended(hand, 16) && isFingerExtended(hand, 20)) {
    results.find(r => r.sign === 'hello')!.confidence = 0.85;
  }
  
  // Detect Thanks sign (fingers touching lips - simplified for demo)
  else if (isFingerExtended(hand, 8) && isFingerExtended(hand, 12) && !isFingerExtended(hand, 16) && !isFingerExtended(hand, 20)) {
    results.find(r => r.sign === 'thanks')!.confidence = 0.75;
  }
  
  // Detect Sorry sign (simplified for demo)
  else if (!isFingerExtended(hand, 8) && isFingerExtended(hand, 12) && !isFingerExtended(hand, 16) && !isFingerExtended(hand, 20)) {
    results.find(r => r.sign === 'sorry')!.confidence = 0.7;
  }
  
  // Detect Help sign (simplified for demo)
  else if (isFingerExtended(hand, 8) && !isFingerExtended(hand, 12) && isFingerExtended(hand, 16) && !isFingerExtended(hand, 20)) {
    results.find(r => r.sign === 'help')!.confidence = 0.8;
  }
  
  // If no confident prediction, choose "none"
  if (results.every(r => r.sign !== 'none' && r.confidence < 0.7)) {
    results.find(r => r.sign === 'none')!.confidence = 0.8;
  }
  
  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
};

// Helper function to check if a finger is extended
function isFingerExtended(hand: { x: number, y: number, z: number }[], tipIdx: number): boolean {
  if (!hand || hand.length < 21) return false;
  
  // Get appropriate MCP joint based on which finger we're checking
  let mcpIdx;
  if (tipIdx === 4) mcpIdx = 1;       // thumb
  else if (tipIdx === 8) mcpIdx = 5;  // index
  else if (tipIdx === 12) mcpIdx = 9; // middle
  else if (tipIdx === 16) mcpIdx = 13; // ring
  else if (tipIdx === 20) mcpIdx = 17; // pinky
  else return false;
  
  // For simplicity, we'll consider a finger extended if its tip is significantly
  // farther from the wrist than its MCP joint
  const wrist = hand[0];
  const mcp = hand[mcpIdx];
  const tip = hand[tipIdx];
  
  const mcpToWristDist = distanceBetween(mcp, wrist);
  const tipToWristDist = distanceBetween(tip, wrist);
  
  return tipToWristDist > mcpToWristDist * 1.5;
}

// Helper to check if any finger is extended
function isAnyFingerExtended(hand: { x: number, y: number, z: number }[]): boolean {
  return isFingerExtended(hand, 8) || isFingerExtended(hand, 12) || isFingerExtended(hand, 16) || isFingerExtended(hand, 20);
}

// Calculate distance between two points
function distanceBetween(p1: { x: number, y: number, z: number }, p2: { x: number, y: number, z: number }): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow(p1.z - p2.z, 2)
  );
}
