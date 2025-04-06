
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SignType } from '@/services/signRecognizer';

interface SignPredictionCardProps {
  currentSign: SignType;
  predictions: { sign: SignType, confidence: number }[];
}

const SignPredictionCard: React.FC<SignPredictionCardProps> = ({
  currentSign,
  predictions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Sign</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-4xl font-bold text-center py-6 rounded-lg border-2 border-accent bg-accent/10">
            {currentSign === 'none' ? '...' : currentSign}
          </div>
        </div>

        <div className="space-y-3">
          {['hello', 'sorry', 'thanks', 'iloveyou', 'yes', 'no', 'help'].map((sign) => {
            const prediction = predictions.find(p => p.sign === sign);
            const confidence = prediction?.confidence || 0;
            const isActive = currentSign === sign;
            
            return (
              <div key={sign} className={`sign-box ${isActive ? 'active' : ''}`}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize font-medium">{sign}</span>
                  <span>{Math.round(confidence * 100)}%</span>
                </div>
                <Progress value={confidence * 100} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignPredictionCard;
