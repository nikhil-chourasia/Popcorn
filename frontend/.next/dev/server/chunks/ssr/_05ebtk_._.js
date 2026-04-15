module.exports = [
"[project]/src/components/Scales.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Scales
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function Scales({ orientation = "diagonal", size = 12, color = "rgba(255,255,255,0.045)", style = {}, className = "" }) {
    const s = size;
    const c = encodeURIComponent(color);
    const patterns = {
        diagonal: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cpath d='M0 ${s} L${s} 0' stroke='${c}' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        horizontal: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cline x1='0' y1='${s}' x2='${s}' y2='${s}' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`,
        vertical: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'%3E%3Cline x1='${s}' y1='0' x2='${s}' y2='${s}' stroke='${c}' stroke-width='1'/%3E%3C/svg%3E")`
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            backgroundImage: patterns[orientation] ?? patterns.diagonal,
            backgroundRepeat: "repeat",
            backgroundSize: `${s}px ${s}px`,
            ...style
        }
    }, void 0, false, {
        fileName: "[project]/src/components/Scales.js",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=_05ebtk_._.js.map