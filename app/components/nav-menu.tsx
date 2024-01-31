import logo from "../assets/logo.svg";

const NavMenu = () => {
	return (
		<header className="flex h-12 justify-center items-center">
			<img className="h-10 w-10" src={logo} alt="VoiceDeck Logo" />
		</header>
	);
};

NavMenu.displayName = "NavMenu";

export { NavMenu };
