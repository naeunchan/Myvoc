declare module "@expo/vector-icons" {
	import * as React from "react";
	type IconProps = {
		name: string;
		size?: number;
		color?: string;
	};

	export class MaterialIcons extends React.Component<IconProps> {}
}
