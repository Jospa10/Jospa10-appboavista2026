
import React, { useState, useRef } from 'react';
import { Player, Position } from './types';

interface PlayerFormProps {
  onSave: (player: Partial<Player>) => void;
  initialData?: Player;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Player>>(initialData || { name: '', nickname: '', number: 0, position: Position.MF, photo: '' });
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Não foi possível acessar a câmera."); }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setFormData({ ...formData, photo: canvasRef.current.toDataURL('image/jpeg') });
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full bg-slate-800 border-2 border-emerald-500 overflow-hidden shadow-xl">
          {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl font-sport">?</div>}
        </div>
        <div className="flex gap-2 w-full">
          <button type="button" onClick={startCamera} className="flex-1 bg-slate-800 text-white text-[10px] font-bold py-2 rounded-lg border border-slate-700">📷 Câmera</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 bg-slate-800 text-white text-[10px] font-bold py-2 rounded-lg border border-slate-700">📁 Galeria</button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
              reader.readAsDataURL(file);
            }
          }} />
        </div>
        {showCamera && (
          <div className="w-full bg-black rounded-xl overflow-hidden p-2 border border-emerald-500/30 flex flex-col gap-2">
            <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded-lg" />
            <div className="flex gap-2">
              <button onClick={capturePhoto} className="flex-1 bg-emerald-600 py-2 rounded-lg font-bold text-[10px] uppercase">Capturar</button>
              <button onClick={stopCamera} className="flex-1 bg-red-600 py-2 rounded-lg font-bold text-[10px] uppercase">Cancelar</button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" placeholder="Nome Completo" /></div>
        <div><input type="text" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" placeholder="Apelido" /></div>
        <div><input type="number" value={formData.number} onChange={e => setFormData({...formData, number: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white" placeholder="Nº" /></div>
        <div className="col-span-2"><select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value as Position})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white">{Object.values(Position).map(pos => <option key={pos} value={pos}>{pos}</option>)}</select></div>
      </div>
      <button onClick={() => onSave(formData)} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold uppercase tracking-widest text-white shadow-lg">Salvar Atleta</button>
    </div>
  );
};

export default PlayerForm;
