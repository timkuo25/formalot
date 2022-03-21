const Navbar = () => {
    return(
        <header className="header">
            <h1 className="app-title">Formalot</h1>
            <nav className="navbar">
                <button className="nav-option">探索</button>
                <button className="nav-option">製作</button>
                <button className="nav-option user-dropdown">
                    User
                    <div className="user-dropdown-options">
                        <button>管理問卷</button>
                        <button>個人資料</button>
                    </div>
                </button>
            </nav>
        </header>
    )
}

export { Navbar };