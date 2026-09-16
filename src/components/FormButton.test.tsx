import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormButton from "./FormButton";

describe("FormButton", () => {
    it("renderiza el texto recibido como children", () => {
        render(<FormButton>Guardar</FormButton>);
        expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
    });

    it("ejecuta onClick al hacer clic", async () => {
        const handleClick = vi.fn();
        render(<FormButton onClick={handleClick}>Enviar</FormButton>);
        await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("no ejecuta onClick cuando está disabled", async () => {
        const handleClick = vi.fn();
        render(
        <FormButton onClick={handleClick} disabled>
            Enviar
        </FormButton>
        );
        await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
        expect(handleClick).not.toHaveBeenCalled();
    });
});