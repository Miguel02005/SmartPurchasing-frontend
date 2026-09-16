import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "./FormInput";

describe("FormInput", () => {
    it("muestra el label recibido", () => {
        render(<FormInput label="Correo" value="" onChange={() => {}} />);
        expect(screen.getByLabelText("Correo")).toBeInTheDocument();
    });

    it("llama a onChange cuando el usuario escribe", async () => {
        const handleChange = vi.fn();
        render(<FormInput label="Correo" value="" onChange={handleChange} />);
        await userEvent.type(screen.getByLabelText("Correo"), "a");
        expect(handleChange).toHaveBeenCalled();
    });

    it("refleja el valor recibido por props", () => {
        render(<FormInput label="Correo" value="test@test.com" onChange={() => {}} />);
        expect(screen.getByLabelText("Correo")).toHaveValue("test@test.com");
    });
});