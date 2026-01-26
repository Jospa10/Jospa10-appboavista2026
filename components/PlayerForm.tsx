
import React, { useState, useRef } from 'react';
import { Player, Position } from '../types';

interface PlayerFormProps {
  onSave: (player: Partial<Player>) => void;
  initialData?: Player;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Player>>(initialData || {
    name: '',
    nickname: '',
    number: 0,
    position: Position.MF,
    photo: ''
  });
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erro ao acessar câmera", err);
      alert("Não foi possível acessar a câmera.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setFormData({ ...formData, photo: dataUrl });
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full bg-slate-800 border-2 border-emerald-500 overflow-hidden shadow-xl group">
          {formData.photo ? (
            <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <span className="text-4xl font-sport">?</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Foto do Atleta</span>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <button 
            type="button"
            onClick={startCamera}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
          >
            📷 Câmera
          </button>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
          >
            📁 Galeria
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload} 
          />
        </div>

        {showCamera && (
          <div className="w-full bg-black rounded-xl overflow-hidden flex flex-col gap-2 p-2 border border-emerald-500/30">
            <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded-lg" />
            <div className="flex gap-2">
              <button onClick={capturePhoto} className="flex-1 bg-emerald-600 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest">Capturar</button>
              <button onClick={stopCamera} className="flex-1 bg-red-600 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest">Cancelar</button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Nome Completo</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            placeholder="Ex: Ricardo Silva"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Apelido</label>
          <input 
            type="text" 
            value={formData.nickname}
            onChange={e => setFormData({...formData, nickname: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            placeholder="Ex: Ricardinho"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Número</label>
          <input 
            type="number" 
            value={formData.number}
            onChange={e => setFormData({...formData, number: parseInt(e.target.value) || 0})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
          />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Posição</label>
          <select 
            value={formData.position}
            onChange={e => setFormData({...formData, position: e.target.value as Position})}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          >
            {Object.values(Position).map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={() => onSave(formData)}
        className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
      >
        Salvar Atleta
      </button>
    </div>
  );
};

export default PlayerForm;
