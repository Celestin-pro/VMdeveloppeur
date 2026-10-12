from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="VMdeveloppeur API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Toutes les routes sont servies sous /api, comme exposé publiquement par Vercel
# et attendu par le frontend (fetch('/api/vms')).
router = APIRouter(prefix="/api")


class VMRequest(BaseModel):
    name: str = Field(min_length=1, max_length=64)
    os_type: str = Field(min_length=1, max_length=64)
    ram_mb: int = Field(ge=512, le=131072)
    cpu_cores: int = Field(ge=1, le=64)
    disk_gb: int = Field(ge=10, le=4096)
    network: Literal["nat", "bridged", "host-only"] = "nat"


@dataclass
class VirtualMachine:
    id: str
    name: str
    os_type: str
    ram_mb: int
    cpu_cores: int
    disk_gb: int
    network: str
    status: str = "ready"


VMS: list[VirtualMachine] = [
    VirtualMachine(
        id=str(uuid4()),
        name="Ubuntu-Dev",
        os_type="Ubuntu 24.04",
        ram_mb=4096,
        cpu_cores=2,
        disk_gb=40,
        network="nat",
    )
]


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/vms")
def list_vms() -> list[dict]:
    return [asdict(vm) for vm in VMS]


@router.post("/vms")
def create_vm(request: VMRequest) -> dict:
    vm = VirtualMachine(
        id=str(uuid4()),
        name=request.name,
        os_type=request.os_type,
        ram_mb=request.ram_mb,
        cpu_cores=request.cpu_cores,
        disk_gb=request.disk_gb,
        network=request.network,
        status="created",
    )
    VMS.insert(0, vm)
    return asdict(vm)


app.include_router(router)


def main() -> None:
    import uvicorn

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
