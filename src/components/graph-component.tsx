"use client";

import {
	type Edge,
	Position,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ExternalLink } from "lucide-react";

type NodeType = "video" | "webpage" | "text";

interface NodeContent {
	type: NodeType;
	url?: string;
	text?: string;
	title: string;
	sourcePosition?: Position;
	targetPosition?: Position;
	position: { x: number; y: number };
}

const generateNodes = (contents: NodeContent[]) => {
	return contents.map((content, index) => {
		const dimensions = getNodeDimensions(content.type);
		return {
			id: `node-${index + 1}`,
			position: content.position,
			sourcePosition: content?.sourcePosition || Position.Bottom,
			targetPosition: content?.targetPosition || Position.Top,
			data: {
				label: (
					<div className="relative h-full w-full">
						{(content.type === "webpage" || content.type === "video") && (
							<a
								href={content.url}
								target="_blank"
								rel="noopener noreferrer"
								className="-top-8 absolute right-0 flex items-center gap-2 text-gray-600 text-sm hover:text-blue-500"
							>
								Open {content.title} <ExternalLink size={16} />
							</a>
						)}
						{renderContent(content)}
					</div>
				),
			},
			style: {
				width: dimensions.width,
				height: dimensions.height,
				padding: "8px",
				borderRadius: "8px",
				backgroundColor: "white",
				boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
			},
		};
	});
};

const getNodeDimensions = (type: NodeType) => {
	switch (type) {
		case "video":
			return { width: 560, height: 315 };
		case "webpage":
			return { width: 800, height: 600 };
		case "text":
			return { width: 300, height: 100 };
		default:
			return { width: 300, height: 200 };
	}
};

const renderContent = (content: NodeContent) => {
	switch (content.type) {
		case "video":
			return (
				<iframe
					className="h-full w-full rounded-lg"
					src={content.url}
					title={content.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
					allowFullScreen
				/>
			);
		case "webpage":
			return (
				<iframe
					className="h-full w-full rounded-lg"
					src={content.url}
					title={content.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
				/>
			);
		case "text":
			return (
				<div className="h-full w-full rounded-lg bg-white">{content.text}</div>
			);
	}
};

export default function GraphComponent() {
	const sampleContents: NodeContent[] = [
		{
			type: "video",
			url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
			title: "Featured Video",
			position: { x: 200, y: 50 },
		},
		{
			type: "webpage",
			url: "https://nextjs.org/",
			title: "Next.js Documentation",
			sourcePosition: Position.Right,
			position: { x: 100, y: 500 },
		},
		{
			type: "text",
			text: "This is a dynamic text node",
			title: "Text Note",
			targetPosition: Position.Left,
			position: { x: 950, y: 750 },
		},
	];

	const initialEdges: Edge[] = [
		{
			id: "e1-2",
			source: "node-1",
			target: "node-2",
			type: "default",
		},
		{
			id: "e2-3",
			source: "node-2",
			target: "node-3",
			type: "default",
			style: { strokeWidth: 2 },
		},
	];

	const [nodes] = useNodesState(generateNodes(sampleContents));
	const [edges] = useEdgesState(initialEdges);

	return (
		<div className="h-[70vh] w-full overflow-hidden rounded-xl border shadow-lg">
			<ReactFlow nodes={nodes} edges={edges} fitView />
		</div>
	);
}
