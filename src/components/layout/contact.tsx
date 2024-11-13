import { BLUR_FADE_DELAY, DATA } from "@/constants/resume";
import { cn } from "@/lib/utils";
import { IconBrandTwitter, IconBrandWhatsapp } from "@tabler/icons-react";
import Link from "next/link";
import BlurFade from "../ui/blur-fade";

export default function Contact() {
	return (
		<section id="contact">
			<div className="grid w-full items-center justify-center gap-4 px-4 py-6 text-center md:px-6">
				<BlurFade delay={BLUR_FADE_DELAY * 11}>
					<div className="space-y-3">
						<div className="inline-block rounded-lg bg-foreground px-3 py-1 text-background text-sm">
							Contact
						</div>
						<h2 className="font-bold text-3xl tracking-tighter md:text-5xl">
							Get in Touch
						</h2>
						<p className="mx-auto max-w-[600px] text-pretty text-muted-foreground md:text-lg">
							Want to chat? Just shoot me a dm{" "}
							<Link
								href={DATA.contact.social.WhatsApp.url}
								target="_blank"
								className={cn(
									"items-center gap-x-2 text-green-500",
									"relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full",
									"after:origin-bottom-left after:scale-x-100 after:bg-green-500 after:transition-transform",
									"after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0",
								)}
							>
								on WhatsApp <IconBrandWhatsapp className="inline size-5" />
							</Link>{" "}
							or{""}
							<br />
							<Link
								href={DATA.contact.social.X.url}
								target="_blank"
								className={cn(
									"items-center gap-x-2 text-blue-500",
									"relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full",
									"after:origin-bottom-left after:scale-x-100 after:bg-blue-500 after:transition-transform",
									"after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0",
								)}
							>
								with a direct question on Twitter{" "}
								<IconBrandTwitter className="inline size-5" />
							</Link>{" "}
							and I&apos;ll respond whenever I can.
							<br />I will ignore all soliciting.
						</p>
					</div>
				</BlurFade>
			</div>
		</section>
	);
}
