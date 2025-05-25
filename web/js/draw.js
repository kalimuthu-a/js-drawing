const draw = {};
export default draw;

draw.path = (ctx, path, color, strokeW) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeW;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for(let i=0; i<path.length; i++) {
    const [x, y] = path[i];
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

draw.paths = (ctx, paths, color = '#000000', strokeW = 3) => {
  for (let i = 0; i < paths.length; i++) {
    draw.path(ctx, paths[i], color, strokeW);
  }
}