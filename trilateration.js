const math = require('mathjs');

function radians(degrees) {
	var pi = Math.PI;
	return degrees * (pi / 180);
}

function degrees(radians) {
	var pi = Math.PI;
	return radians * (180 / pi);
}

module.exports = function (LatA, LonA, DistA, LatB, LonB, DistB, LatC, LonC, DistC) {

	const earthR = 6371

	const xA = earthR * (math.cos(radians(LatA)) * math.cos(radians(LonA)));
	const yA = earthR * (math.cos(radians(LatA)) * math.sin(radians(LonA)));
	const zA = earthR * (math.sin(radians(LatA)));
	console.log(xA, yA, zA);

	const xB = earthR * (math.cos(radians(LatB)) * math.cos(radians(LonB)));
	const yB = earthR * (math.cos(radians(LatB)) * math.sin(radians(LonB)));
	const zB = earthR * (math.sin(radians(LatB)));
	console.log(xB, yB, zB);

	const xC = earthR * (math.cos(radians(LatC)) * math.cos(radians(LonC)));
	const yC = earthR * (math.cos(radians(LatC)) * math.sin(radians(LonC)));
	const zC = earthR * (math.sin(radians(LatC)));
	console.log(xC, yC, zC);

	const P1 = [xA, yA, zA];
	// const P2 = [xB, yB, zB];
	// const P3 = [xC, yC, zC];
	const P2minusP1 = [xB - xA, yB - yA, zB - zA]
	const P3minusP1 = [xC - xA, yC - yA, zC - zA]
	console.log(P2minusP1);

	// from wikipedia
	// transform to get circle 1 at origin
	// transform to get circle 2 on x axis
	
	const ex = [P2minusP1[0] / math.norm(P2minusP1), P2minusP1[1] / math.norm(P2minusP1), P2minusP1[2] / math.norm(P2minusP1)]
	const i = math.dot(ex, P3minusP1)

	const ey = []
	ey[0] = ((P3minusP1[0] - i * ex[0]) / (math.norm([P3minusP1[0] - i * ex[0],P3minusP1[1] - i * ex[1],P3minusP1[2] - i * ex[2]])))
	ey[1] = ((P3minusP1[1] - i * ex[1]) / (math.norm([P3minusP1[0] - i * ex[0],P3minusP1[1] - i * ex[1],P3minusP1[2] - i * ex[2]])))
	ey[2] = ((P3minusP1[2] - i * ex[2]) / (math.norm([P3minusP1[0] - i * ex[0],P3minusP1[1] - i * ex[1],P3minusP1[2] - i * ex[2]])))

	const ez = math.cross(ex, ey)
	const d = math.norm(P2minusP1)
	const j = math.dot(ey, P3minusP1)

	const x = (math.pow(DistA, 2) - math.pow(DistB, 2) + math.pow(d, 2)) / (2 * d)
	const y = (((DistA**2) - (DistC**2) + (i**2) + (j**2)) / (2 * j)) - ((i / j) * x)

	//  only one case shown here
	const z = Math.sqrt(Math.abs(DistA**2 - x**2 - y**2))

	// triPt is an array with ECEF x,y,z of trilateration point
	const triPt = [];
	triPt[0] = (P1[0]) + (x*ex[0]) + (y*ey[0])  + (z*ez[0])
	triPt[1] = (P1[1]) + (x*ex[1]) + (y*ey[1])  + (z*ez[1])
	triPt[2] = (P1[2]) + (x*ex[2]) + (y*ey[2])  + (z*ez[2])

	// convert back to lat/long from ECEF
	// convert to degrees
	const lat = degrees(math.asin(triPt[2] / earthR))
	const lon = degrees(math.atan2(triPt[1], triPt[0]))

	return ([lat, lon])

}