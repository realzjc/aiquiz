import { useState } from 'react';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const quizzes = [
        { id: 1, title: 'Math Quiz' },
        { id: 2, title: 'Physics Practice' },
        { id: 3, title: 'CS Fundamentals' },
        { id: 4, title: 'English Vocab' },
        { id: 5, title: 'GRE Logic' },
    ];

    return (
        <div
            style={{
                width: collapsed ? '60px' : '260px',
                backgroundColor: '#f3f4f6',
                transition: 'width 0.3s',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* 上方按钮区（可空） */}
            <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <button onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            {/* 下方题库列表 */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '10px',
                }}
            >
                {quizzes.map((quiz) => (
                    <div
                        key={quiz.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: '8px 12px',
                            marginBottom: '8px',
                            borderRadius: '5px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        <span
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {quiz.title}
                        </span>
                        <button title="More options">⋯</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
