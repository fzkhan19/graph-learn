"use client";

import {
	type Edge,
	PanOnScrollMode,
	Position,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type NodeType = "video" | "webpage" | "text";

interface NodeContent {
	type: NodeType;
	url?: string;
	text?: string;
	title: string;
}

interface Relationship {
	source: number; // Index of the source node
	target: number; // Index of the target node
}

const getNodeDimensions = (type: NodeType) => {
	switch (type) {
		case "video":
			return { width: 800, height: 500 };
		case "webpage":
			return { width: 900, height: 1000 };
		case "text":
			return { width: 500, height: 300 };
		default:
			return { width: 300, height: 200 };
	}
};

// Generate node positions based on relationships and dimensions
const generatePositions = (
	contents: NodeContent[],
	relationships: Relationship[],
	startPosition = { x: 100, y: 100 },
	padding = 100,
) => {
	const positions: { x: number; y: number }[] = [];
	const placedNodes = new Set<number>();

	// Place the first node at the starting position
	positions[0] = startPosition;
	placedNodes.add(0);

	// Recursive function to place child nodes
	const placeNode = (sourceIndex: number, targetIndex: number) => {
		if (placedNodes.has(targetIndex)) return; // Avoid placing the same node twice

		const sourcePosition = positions[sourceIndex];
		const sourceDimensions = getNodeDimensions(contents[sourceIndex].type);
		const targetDimensions = getNodeDimensions(contents[targetIndex].type);

		// Calculate vertical position based on source node
		positions[targetIndex] = {
			x:
				sourcePosition.x +
				(sourceDimensions.width - targetDimensions.width) / 2,
			y: sourcePosition.y + sourceDimensions.height + padding,
		};
		placedNodes.add(targetIndex);
	};

	// Traverse relationships to position nodes
	for (const { source, target } of relationships) {
		if (!positions[source]) {
			throw new Error(`Source node at index ${source} is not placed.`);
		}
		placeNode(source, target);
	}

	return positions;
};
// Generate nodes with dimensions and position
const generateNodes = (
	contents: NodeContent[],
	relationships: Relationship[],
	startPosition = { x: 100, y: 100 },
) => {
	const positions = generatePositions(contents, relationships, startPosition);

	return contents.map((content, index) => {
		const dimensions = getNodeDimensions(content.type);
		return {
			id: `node-${index + 1}`,
			position: positions[index],
			sourcePosition: Position.Bottom,
			targetPosition: Position.Top,
			data: {
				label: (
					<div className="relative h-full w-full">
						{(content.type === "webpage" || content.type === "video") &&
							content.url && (
								<Link
									href={content.url}
									target="_blank"
									rel="noopener noreferrer"
									className="-top-10 absolute right-0 flex items-center gap-2 text-gray-600 text-lg hover:text-blue-500"
								>
									Open {content.title} <ExternalLink size={18} />
								</Link>
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

// Render the content of the nodes based on their type
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

// Calculate the translateExtent based on the positions of the nodes and the last node's position
const calculateTranslateExtent = (
	positions: { x: number; y: number }[],
	contents: NodeContent[],
): [[number, number], [number, number]] => {
	const startX = Math.min(...positions.map((pos) => pos.x));
	const startY = Math.min(...positions.map((pos) => pos.y));
	const endX = Math.max(
		...positions.map(
			(pos, index) => pos.x + getNodeDimensions(contents[index].type).width,
		),
	);
	const endY = Math.max(
		...positions.map(
			(pos, index) => pos.y + getNodeDimensions(contents[index].type).height,
		),
	);

	// Adjust translate extent to fit all nodes without infinite panning
	return [
		[startX, startY - 200], // Padding to prevent edge cutoff
		[endX, endY + 200], // Padding to prevent edge cutoff
	];
};

export default function GraphComponent() {
	const sampleContents: NodeContent[] = [
		{
			type: "video",
			url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
			title: "Featured Video",
		},
		{
			type: "webpage",
			url: "https://nextjs.org/",
			title: "Next.js Documentation",
		},
		{
			type: "text",
			text: "This is a dynamic text node",
			title: "Text Note",
		},
	];

	const relationships: Relationship[] = [
		{ source: 0, target: 1 }, // Node 1 -> Node 2
		{ source: 1, target: 2 }, // Node 2 -> Node 3
	];

	const initialEdges: Edge[] = relationships.map((rel) => ({
		id: `e${rel.source + 1}-${rel.target + 1}`,
		source: `node-${rel.source + 1}`,
		target: `node-${rel.target + 1}`,
		type: "default",
		style: { strokeWidth: 2 },
	}));

	const [nodes] = useNodesState(generateNodes(sampleContents, relationships));
	const [edges] = useEdgesState(initialEdges);

	// Calculate translate extent based on node positions
	const positions = generatePositions(sampleContents, relationships);
	const translateExtent = calculateTranslateExtent(positions, sampleContents);

	return (
		<div className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				zoomOnScroll={false}
				panOnDrag={false}
				panOnScroll={true}
				panOnScrollMode={PanOnScrollMode.Vertical}
				maxZoom={0.5}
				minZoom={0.5}
				zoomOnDoubleClick={false}
				zoomOnPinch={false}
				nodesDraggable={false}
				translateExtent={translateExtent}
			/>
		</div>
	);
}
