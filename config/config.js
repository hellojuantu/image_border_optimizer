var config = {
    preButton: {
        _comment: "pre image",
        type: "button",
    },
    nextButton: {
        _comment: "next image",
        type: "button",
    },
    centerButton: {
        _comment: "center image",
        type: "button",
    },
    penClearButton: {
        _comment: "pen clear",
        type: "button",
    },
    index: {
        _comment: "background index",
        value: 0,
        default: 0,
        valueType: 'number',
        min: 0,
        max: -1,
        type: "number",
    },
    imageOffset: {
        _comment: "background offset",
        value: 80,
        default: 80,
        valueType: 'number',
        min: -100,
        max: 100,
        type: "number",
    },
    shadowOffset: {
        _comment: "shadow offset",
        value: 18,
        default: 18,
        valueType: 'number',
        min: -50,
        max: 50,
        type: "number",
    },
    shadowBlur: {
        _comment: "shadow blur level",
        value: 23,
        default: 23,
        valueType: 'number',
        min: 0,
        max: 30,
        type: "number",
    },
    shadowColorAlpha: {
        _comment: "shadow color alpha",
        value: 5,
        default: 5,
        valueType: 'number',
        min: 0,
        max: 10,
        type: "number",
    },
    shadowColor: {
        _comment: "shadow color",
        value: '#000000',
        default: '#000000',
        valueType: 'string',
        type: "color",
    },
    borderLength: {
        _comment: "border length:",
        value: 1,
        default: 1,
        valueType: 'number',
        // min: 0,
        // max: 30,
        // type: "number",
    },
    borderColor: {
        _comment: "border color",
        value: '#000000',
        default: '#000000',
        valueType: 'string',
        type: "color",
    },
    penEnabled: {
        _comment: "pen enabled",
        value: 'false',
        default: 'false',
        valueType: 'boolean',
        type: "checkbox",
    },
    penWeight: {
        _comment: "pen weight:",
        value: 2,
        default: 2,
        valueType: 'number',
        min: 0,
        max: 10,
        type: "number",
    },
    penColor: {
        _comment: "pen color",
        value: "#000000",
        default: '#000000',
        valueType: "string",
        type: "color",
    },
    textInputEnabled: {
        _comment: "text input enabled",
        value: 'false',
        default: 'false',
        valueType: 'boolean',
        type: "checkbox",
    },
    textFont: {
        _comment: "text font",
        value: "20px Arial",
        default: "20px Arial",
        valueType: "string",
        type: "text",
    },
    textColor: {
        _comment: "text font color",
        value: "#000000",
        default: "#000000",
        valueType: "string",
        type: "color",
    },
    shapeEnabled: {
        _comment: "shape enabled",
        value: 'false',
        default: 'false',
        valueType: 'boolean',
        type: "checkbox",
    },
    shapeSelect: {
        _comment: "shape select",
        value: 'rect',
        default: null,
        valueType: 'string',
        type: "text",
    },
    shapeColor: {
        _comment: "shape color",
        value: "#000000",
        default: '#000000',
        valueType: "string",
        type: "color",
    },
    shapeBorder: {
        _comment: "shape border",
        value: 3,
        default: 3,
        valueType: 'number',
        min: 3,
        max: 20,
        type: "number",
    },
    shapeFill: {
        _comment: "shape fill",
        value: "false",
        default: 'false',
        valueType: 'boolean',
        type: "text",
        options: [
            'false',
            'true',
        ],
    },
    shapeWidth: {
        _comment: "shape width",
        value: 0,
        default: null,
        valueType: 'number',
        min: 1,
        type: "number",
    },
    shapeHeight: {
        _comment: "shape height",
        value: 0,
        default: null,
        valueType: 'number',
        min: 1,
        type: "number",
    },
    shapeX: {
        _comment: "shape x",
        value: 0,
        default: null,
        valueType: 'number',
        min: 1,
        type: "number",
    },
    shapeY: {
        _comment: "shape y",
        value: 0,
        default: null,
        valueType: 'number',
        min: 1,
        type: "number",
    },
    shapeRadiusX: {
        _comment: "shape radius x",
        value: 0,
        default: null,
        valueType: 'number',
        min: 1,
        type: "number",
    },
    shapeRadiusY: {
        _comment: "shape radius y",
        value: 0,
        default: null,
        valueType: 'number',
        min: 1,
        type: "number",
    },
    zoom: {
        _comment: "zoom",
        value: 100,
        default: 100,
        valueType: 'number',
        type: "number",
    },
    defaultPointerEnable: {
        _comment: "default pointer enable",
        value: 'false',
        default: 'false',
        valueType: 'boolean',
        type: "checkbox",
    },
    canvasHeight: {
        _comment: "canvas height",
        value: 800,
        default: 800,
        valueType: 'number',
        type: "number",
    },
    canvasWidth: {
        _comment: "canvas width",
        value: 1000,
        default: 1000,
        valueType: 'number',
        type: "number",
    },
}

var uploadConfig = {
    max_size: 3 * 1024 * 1024,
    max_size_desc: "3MB"
}
