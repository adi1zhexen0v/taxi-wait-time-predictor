import { divIcon } from "leaflet";

function pointIcon(color: string) {
  return divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="width:18px;height:18px;border:3px solid white;border-radius:50%;background:${color};box-shadow:0 0 0 12px ${color}2b,0 2px 6px #0005"></div>`
  });
}

export const driverIcon = pointIcon("#111111");
export const passengerIcon = pointIcon("#276ef1");

export function carIcon(minutes: number) {
  return divIcon({
    className: "",
    iconSize: [26, 14],
    iconAnchor: [13, 7],
    html:
      '<div style="position:absolute;left:50%;bottom:30px;transform:translateX(-50%);background:white;border-radius:10px;padding:7px 12px;box-shadow:0 4px 14px #0003;text-align:center;white-space:nowrap;font-family:Manrope,sans-serif">' +
      '<div style="font-size:12px;font-weight:600;color:#444">Arrives in</div>' +
      '<div style="font-size:19px;font-weight:800;color:#111;line-height:1.1">' +
      minutes.toFixed(1) +
      " min</div></div>" +
      '<div style="width:26px;height:14px;background:#111;border:2px solid white;border-radius:5px;box-shadow:0 2px 6px #0005"><div style="position:absolute;right:4px;top:4px;width:5px;height:6px;background:#9ec1ff;border-radius:1px"></div></div>'
  });
}
