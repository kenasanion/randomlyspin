import { Button } from "@/components/ui/button";
import { CoffeeIcon, InfoIcon } from "lucide-react";

const Footer = () => {
    return (
        <footer className="flex flex-row max-lg:flex-col gap-5 items-center justify-between py-5 px-8" aria-label="Footer">
            <p aria-label="Copyright" className="text-sm font-bold text-white">&copy; 2026 - Great Elf Archer™</p>
            <div className="flex flex-row gap-5">
                <Button className="font-bold" aria-label="Support Me">
                    <CoffeeIcon aria-hidden="true" /> Support Me
                </Button>
                <Button className="font-bold" aria-label="About">
                    <InfoIcon aria-hidden="true" /> About
                </Button>
            </div>
        </footer>
    )
}

export default Footer;