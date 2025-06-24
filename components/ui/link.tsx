import { cn } from "@/lib/utils";
import NextLink, { type LinkProps } from "next/link";
import { forwardRef } from "react";

// Combines Next.js routing props with standard anchor attributes
export type CustomLinkProps = LinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

// eslint-disable-next-line react/display-name
const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>(
	({ href, className, children, ...props }, ref) => {
		return (
			<NextLink
				ref={ref}
				href={href}
				className={cn(" hover:underline text-blue-500 ", className)}
				{...props}
			>
				{children}
			</NextLink>
		);
	}
);

export default Link;
