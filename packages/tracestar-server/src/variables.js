/*
    Basic Tetris-like T, L, and L-reversed shapes
    in x,y pair coordinate point, minus the origin
*/

export const wallType = Object.freeze({
    T1: [
        [
            -1, 0
        ],
        [
            1, 0
        ],
        [
            0, 1
        ]
    ],
    T2: [
        [
            0, -1
        ],
        [
            1, 0
        ],
        [
            0, 1
        ]
    ],
    T3: [
        [
            1, 0
        ],
        [
            -1, 0
        ],
        [
            0, -1
        ]
    ],
    T4: [
        [
            0, 1
        ],
        [
            -1, 0
        ],
        [
            0, -1
        ]
    ],
    LR1: [
        [
            2, 0
        ],
        [
            1, 0
        ],
        [
            0, 1
        ]
    ],
    LR2: [
        [
            2, 0
        ],
        [
            1, 0
        ],
        [
            0, -1
        ]
    ],
    LR3: [
        [
            -2, 0
        ],
        [
            -1, 0
        ],
        [
            0, -1
        ]
    ],
    LR4: [
        [
            -2, 0
        ],
        [
            -1, 0
        ],
        [
            0, 1
        ]
    ],
    LL1: [
        [
            0, 2
        ],
        [
            0, 1
        ],
        [
            1, 0
        ]
    ],
    LL2: [
        [
            0, 2
        ],
        [
            0, 1
        ],
        [
            -1, 0
        ]
    ],
    LL3: [
        [
            0, -2
        ],
        [
            0, -1
        ],
        [
            -1, 0
        ]
    ],
    LL4: [
        [
            0, -2
        ],
        [
            0, -1
        ],
        [
            1, 0
        ]
    ]
});

export const wallTypes = Object.keys(wallType);
