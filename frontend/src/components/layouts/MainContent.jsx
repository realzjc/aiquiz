export default function MainContent() {
    const username = 'Jiacheng'; // TODO: 替换为从上下文或API获取的用户名

    return (
        <div
            style={{
                flex: 1,
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
            }}
        >
            Welcome back, {username}!
        </div>
    );
}
