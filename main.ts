import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
function run(p: Uint8Array, q: Uint8Array) {
  const D = new Int32Array(256);
  let s = 0;
  const C = new Int32Array(64);
  let c = 0;
  const M = new Int32Array(256);
  const o = new Uint8Array(65536);
  let l = 0;
  let i = 0;
  let x = 0;
  let t = 0;
  const n = p.length;
  const e = (k: number) => ({ o, l, k });
  for (;;) {
    if (t === 1e6) return e(10);
    if (x < 0 || x >= n) return e(9);
    const a = p[x];
    if (!(a <= 7 || (a >= 0x10 && a <= 0x1e) || (a >= 0x20 && a <= 0x22) || (a >= 0x30 && a <= 0x34) || (a >= 0x40 && a <= 0x41) || (a >= 0x50 && a <= 0x53))) return e(5);
    const m = a === 1 ? 1 : a === 2 ? 4 : a >= 0x30 && a <= 0x33 ? 2 : 0;
    if (x + m >= n) return e(9);
    t++;
    const y = x + 1 + m;
    x = y;
    switch (a) {
      case 0:
        return e(0);
      case 1:
        if (s === 256) return e(3);
        D[s++] = (p[y - 1] << 24) >> 24;
        break;
      case 2:
        if (s === 256) return e(3);
        D[s++] = p[y - 4] | (p[y - 3] << 8) | (p[y - 2] << 16) | (p[y - 1] << 24);
        break;
      case 3:
        if (s < 1) return e(2);
        s--;
        break;
      case 4:
        if (s < 1) return e(2);
        if (s === 256) return e(3);
        D[s] = D[s - 1];
        s++;
        break;
      case 5:
        if (s < 2) return e(2);
        {
          const v = D[s - 1];
          D[s - 1] = D[s - 2];
          D[s - 2] = v;
        }
        break;
      case 6:
        if (s < 2) return e(2);
        if (s === 256) return e(3);
        D[s] = D[s - 2];
        s++;
        break;
      case 7:
        if (s < 3) return e(2);
        {
          const v = D[s - 3];
          D[s - 3] = D[s - 2];
          D[s - 2] = D[s - 1];
          D[s - 1] = v;
        }
        break;
      case 0x17:
        if (s < 1) return e(2);
        D[s - 1] = (-D[s - 1]) | 0;
        break;
      case 0x1b:
        if (s < 1) return e(2);
        D[s - 1] = ~D[s - 1];
        break;
      case 0x30:
      case 0x31:
      case 0x32: {
        const r = ((p[y - 2] | (p[y - 1] << 8)) << 16) >> 16;
        let k = true;
        if (a !== 0x30) {
          if (s < 1) return e(2);
          const v = D[--s];
          k = a === 0x31 ? v === 0 : v !== 0;
        }
        if (k) x = y + r;
        break;
      }
      case 0x33:
        if (c === 64) return e(7);
        C[c++] = y;
        x = p[y - 2] | (p[y - 1] << 8);
        break;
      case 0x34:
        if (c === 0) return e(8);
        x = C[--c];
        break;
      case 0x40: {
        if (s < 1) return e(2);
        const d = D[s - 1];
        if (d < 0 || d >= 256) return e(6);
        D[s - 1] = M[d];
        break;
      }
      case 0x41: {
        if (s < 2) return e(2);
        const d = D[s - 1];
        const v = D[s - 2];
        if (d < 0 || d >= 256) return e(6);
        s -= 2;
        M[d] = v;
        break;
      }
      case 0x50: {
        if (s < 1) return e(2);
        const v = D[s - 1];
        const g = v < 0 ? -v : v;
        let d = 1;
        if (g >= 1e9) d = 10;
        else if (g >= 1e8) d = 9;
        else if (g >= 1e7) d = 8;
        else if (g >= 1e6) d = 7;
        else if (g >= 1e5) d = 6;
        else if (g >= 1e4) d = 5;
        else if (g >= 1e3) d = 4;
        else if (g >= 100) d = 3;
        else if (g >= 10) d = 2;
        const z = d + (v < 0 ? 1 : 0);
        if (l + z > 65536) return e(11);
        s--;
        let w = l + z;
        let u = g;
        while (u >= 10) {
          o[--w] = 48 + (u % 10);
          u = (u / 10) | 0;
        }
        o[--w] = 48 + u;
        if (v < 0) o[--w] = 45;
        l += z;
        break;
      }
      case 0x51:
        if (s < 1) return e(2);
        if (l + 1 > 65536) return e(11);
        o[l++] = D[--s] & 255;
        break;
      case 0x52:
        if (s === 256) return e(3);
        D[s++] = i < q.length ? q[i++] : -1;
        break;
      case 0x53:
        if (s < 1) return e(2);
        return e(D[--s] & 255);
      default: {
        if (s < 2) return e(2);
        const b = D[s - 1];
        const u = D[s - 2];
        let r = 0;
        switch (a) {
          case 0x10:
            r = (u + b) | 0;
            break;
          case 0x11:
            r = (u - b) | 0;
            break;
          case 0x12:
            r = Math.imul(u, b);
            break;
          case 0x13:
            if (b === 0) return e(4);
            r = u === -2147483648 && b === -1 ? u : (u / b) | 0;
            break;
          case 0x14:
            if (b === 0) return e(4);
            r = b === -1 ? 0 : (u % b) | 0;
            break;
          case 0x15:
            if (b === 0) return e(4);
            r = Math.floor((u >>> 0) / (b >>> 0)) | 0;
            break;
          case 0x16:
            if (b === 0) return e(4);
            r = ((u >>> 0) % (b >>> 0)) | 0;
            break;
          case 0x18:
            r = u & b;
            break;
          case 0x19:
            r = u | b;
            break;
          case 0x1a:
            r = u ^ b;
            break;
          case 0x1c:
            r = u << (b & 31);
            break;
          case 0x1d:
            r = u >> (b & 31);
            break;
          case 0x1e:
            r = (u >>> (b & 31)) | 0;
            break;
          case 0x20:
            r = u === b ? 1 : 0;
            break;
          case 0x21:
            r = u < b ? 1 : 0;
            break;
          case 0x22:
            r = (u >>> 0) < (b >>> 0) ? 1 : 0;
            break;
        }
        s -= 2;
        D[s++] = r;
      }
    }
  }
}
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const d of readdirSync(I).sort()) {
  let g: Buffer;
  try {
    g = readFileSync(join(I, d, 'program.bin'));
  } catch {
    continue;
  }
  let q: Buffer;
  try {
    q = readFileSync(join(I, d, 'input.bin'));
  } catch {
    q = Buffer.alloc(0);
  }
  const r = run(new Uint8Array(g), new Uint8Array(q));
  mkdirSync(join(O, d), { recursive: true });
  writeFileSync(join(O, d, 'stdout.bin'), r.o.subarray(0, r.l));
  writeFileSync(join(O, d, 'exit.txt'), r.k + '\n');
}
