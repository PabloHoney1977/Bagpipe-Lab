import numpy as np
x=np.load('audio.npy').astype(float); sr=44100

def acf_f0(fr, fmin=200., fmax=520.):
    fr = fr - fr.mean()
    if np.sqrt((fr**2).mean()) < 0.005: return np.nan
    n=len(fr); a=np.correlate(fr,fr,'full')[n-1:]
    a/= (a[0]+1e-12)
    lo,hi=int(sr/fmax),int(sr/fmin)
    seg=a[lo:hi]
    if len(seg)<3: return np.nan
    i=int(np.argmax(seg))+lo
    if i<=0 or i>=len(a)-1: return np.nan
    # parabolic interpolation
    y0,y1,y2=a[i-1],a[i],a[i+1]
    d=(y0-y2)/(2*(y0-2*y1+y2)+1e-12)
    return sr/(i+d)

N=1024; HOP=64   # 1.45ms hop -> fine transition timing
for tag,(a,b) in {"TAKE 1":(1.8,9.6),"TAKE 2":(13.6,21.3)}.items():
    s0,s1=int(a*sr),int(b*sr)
    f,rm,tt=[],[],[]
    for s in range(s0,s1-N,HOP):
        fr=x[s:s+N]
        f.append(acf_f0(fr)); rm.append(np.sqrt((fr**2).mean())); tt.append(s/sr)
    f=np.array(f); rm=np.array(rm); tt=np.array(tt)
    med=np.array([np.nanmedian(f[max(0,i-3):i+4]) for i in range(len(f))])  # light smoothing
    cents=1200*np.log2(med/np.nanmedian(med))
    d=np.abs(np.gradient(cents))
    thr=np.nanpercentile(d,97)
    print(f"\n=== {tag} ===  rms during take: min {rm.min():.4f} mean {rm.mean():.4f}  (silence would be <0.01)")
    print(f"    frames below 0.01 rms: {(rm<0.01).sum()} of {len(rm)}  -> tone continuous? {'YES' if (rm<0.01).sum()<3 else 'NO'}")
    # locate transitions: contiguous regions of high |d cents/frame|
    hot=d>thr; i=0; trans=[]
    while i<len(hot):
        if hot[i]:
            j=i
            while j+1<len(hot) and (hot[j+1] or (j+2<len(hot) and hot[j+2])): j+=1
            trans.append((i,j)); i=j+1
        else: i+=1
    trans=[t for t in trans if (t[1]-t[0])>=1]
    for (i,j) in trans:
        dur=(tt[j]-tt[i])*1000
        f_before=np.nanmedian(med[max(0,i-40):i-5]); f_after=np.nanmedian(med[j+5:j+45])
        if np.isnan(f_before) or np.isnan(f_after): continue
        jump=1200*np.log2(f_after/f_before)
        if abs(jump)<40: continue
        rmin=rm[i:j+1].min(); rsurr=max(rm[max(0,i-30):i].mean(), rm[j:j+30].mean())
        print(f"    t={tt[i]:6.2f}s  {f_before:6.1f}->{f_after:6.1f}Hz ({jump:+6.0f}c)  glide {dur:5.1f}ms  amplitude dip {100*(1-rmin/(rsurr+1e-9)):4.0f}%")
