import numpy as np
x=np.load('audio.npy').astype(float); sr=44100
NFFT=1<<17
def spec(seg):
    n=min(len(seg),NFFT)
    s=seg[:n]*np.hanning(n)
    mag=np.abs(np.fft.rfft(s,NFFT))
    return mag
BINHZ=sr/NFFT
def peak_near(mag,f,bw=8.0):
    lo=max(0,int((f-bw)/BINHZ)); hi=min(len(mag)-1,int((f+bw)/BINHZ)+1)
    return mag[lo:hi].max() if hi>lo else 0.0
def best_f0(seg, flo=180.0, fhi=900.0, step=0.5):
    mag=spec(seg); ref=mag.max()+1e-12
    cands=np.arange(flo,fhi,step); best=(0,-1)
    for f in cands:
        sc=sum(peak_near(mag,f*k) for k in range(1,9))/ref
        if peak_near(mag,f/2)/ref > 0.10: sc*=0.35
        if sc>best[1]: best=(f,sc)
    # refine
    f=best[0]
    for f2 in np.arange(f-0.6,f+0.6,0.05):
        sc=sum(peak_near(mag,f2*k) for k in range(1,9))/ref
        if peak_near(mag,f2/2)/ref>0.10: sc*=0.35
        if sc>best[1]: best=(f2,sc)
    return best[0]

segs=[("T1-n1",2.2,3.7),("T1-n2",4.2,5.7),("T1-n3",6.2,7.7),("T1-n4",8.2,9.2),
      ("T2-n1",13.9,15.2),("T2-n2",15.7,17.2),("T2-n3",17.7,18.8),("T2-n4",19.2,20.9)]
res=[]
for name,a,b in segs:
    seg=x[int(a*sr):int(b*sr)]
    f0=best_f0(seg)
    W=int(0.20*sr); subs=[]
    for s in range(0,max(1,len(seg)-W),W//2):
        subs.append(best_f0(seg[s:s+W]))
    subs=np.array(subs); med=np.median(subs)
    cents=1200*np.log2(subs/med)
    mag=spec(seg); ref=mag.max()
    harm=[round(peak_near(mag,f0*k)/ref,2) for k in range(1,7)]
    res.append((name,f0,float(np.std(cents))))
    print(f"{name}: f0={f0:7.2f}Hz  drift ±{np.std(cents):4.1f}c over {len(subs)} windows  harm1-6={harm}")

print("\n-- intervals within take --")
for take in ("T1","T2"):
    r=[v for v in res if v[0].startswith(take)]
    lo=min(v[1] for v in r)
    print(f"{take}: "+"  ".join(f"{f:.1f}Hz({1200*np.log2(f/lo):+.0f}c)" for _,f,_ in r))
print("\n-- sorted --")
for n,f,s in sorted(res,key=lambda v:v[1]): print(f"  {n} {f:8.2f}Hz")
np.save('notes.npy', np.array([f for _,f,_ in res]))
